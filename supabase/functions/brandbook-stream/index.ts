// brandbook-stream v2 — reads brandbook_pdf_url from concepts_catalog and supports
// two source types: `presentations/…` (fetched from the live site) or
// `storage://bucket/path` (legacy private bucket). Falls back to `<slug>.pdf`
// in the `brandbooks` bucket for pre-v2 rows. Always overlays an email watermark.

import { createClient } from 'npm:@supabase/supabase-js@2.45.4';
import { PDFDocument, StandardFonts, rgb, degrees } from 'npm:pdf-lib@1.17.1';

const admin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  { auth: { persistSession: false } },
);

const SITE_ORIGIN = Deno.env.get('SITE_ORIGIN') ?? 'https://micro.svita.ai';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

const jerr = (body: unknown, status = 400) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

async function sha1Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-1', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('').slice(0, 10);
}

async function watermark(pdfBytes: Uint8Array, label: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    page.drawRectangle({ x: 0, y: 0, width, height: 22, color: rgb(0,0,0), opacity: 0.55 });
    page.drawText(label, { x: 14, y: 7, size: 9, font, color: rgb(1,1,1), opacity: 0.92 });
    page.drawText(label, {
      x: width * 0.15, y: height * 0.45,
      size: Math.max(22, Math.min(width, height) * 0.045),
      font, color: rgb(1, 1, 1), opacity: 0.08, rotate: degrees(30),
    });
  }
  return await pdfDoc.save({ useObjectStreams: true });
}

async function fetchPdfBytes(slug: string, pdfUrl: string | null): Promise<{ bytes: Uint8Array | null; error?: string }> {
  if (pdfUrl && /^presentations\//.test(pdfUrl)) {
    try {
      const r = await fetch(`${SITE_ORIGIN}/${pdfUrl}`);
      if (!r.ok) return { bytes: null, error: `site_fetch_${r.status}` };
      return { bytes: new Uint8Array(await r.arrayBuffer()) };
    } catch (e) { return { bytes: null, error: `site_fetch_${String(e).slice(0,80)}` }; }
  }
  if (pdfUrl && /^storage:\/\//.test(pdfUrl)) {
    const m = pdfUrl.match(/^storage:\/\/([^/]+)\/(.+)$/);
    if (m) {
      const [, bucket, path] = m;
      const { data, error } = await admin.storage.from(bucket).download(path);
      if (error || !data) return { bytes: null, error: error?.message || 'storage_missing' };
      return { bytes: new Uint8Array(await data.arrayBuffer()) };
    }
  }
  const { data, error } = await admin.storage.from('brandbooks').download(`${slug}.pdf`);
  if (error || !data) return { bytes: null, error: error?.message || 'bucket_missing' };
  return { bytes: new Uint8Array(await data.arrayBuffer()) };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  const url = new URL(req.url);

  if (req.method === 'GET' && url.searchParams.has('ping')) {
    return new Response(JSON.stringify({ ok: true, version: 2 }), { headers: { ...CORS, 'Content-Type':'application/json' }});
  }
  if (req.method !== 'POST' && req.method !== 'GET') return jerr({ error: 'method_not_allowed' }, 405);

  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return jerr({ error: 'unauthorized', reason: 'no_bearer' }, 401);

  const { data: userRes, error: uerr } = await admin.auth.getUser(token);
  if (uerr || !userRes?.user) return jerr({ error: 'unauthorized', reason: uerr?.message || 'no_user' }, 401);
  const user = userRes.user;

  const slug = (req.method === 'POST')
    ? (await req.json().catch(()=>({})))?.slug
    : url.searchParams.get('slug');
  if (!slug || !/^[a-z0-9][a-z0-9-]{1,80}$/.test(String(slug))) return jerr({ error: 'bad_slug' }, 400);

  const { data: prof } = await admin.from('profiles').select('role').eq('user_id', user.id).maybeSingle();
  const isStaff = prof && (prof.role === 'superadmin' || prof.role === 'admin');
  if (!isStaff) {
    const { data: purchase } = await admin.from('purchases')
      .select('tier,status').eq('user_id', user.id).eq('concept_slug', slug).eq('status','paid').maybeSingle();
    if (!purchase) return jerr({ error: 'not_owned' }, 403);
  }

  const { data: row } = await admin.from('concepts_catalog')
    .select('brandbook_pdf_url').eq('slug', slug).maybeSingle();
  const pdfUrl = row?.brandbook_pdf_url ?? null;

  const { bytes: raw, error: fetchErr } = await fetchPdfBytes(slug, pdfUrl);
  if (!raw) return jerr({ error: 'brandbook_missing', slug, detail: fetchErr }, 404);

  const email = user.email || user.id;
  const ts = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const hash = await sha1Hex(`${user.id}:${slug}:${ts}`);
  const label = `${email}  ·  ${ts} UTC  ·  #${hash}  ·  svita micro`;

  let output: Uint8Array;
  try { output = await watermark(raw, label); }
  catch (e) { return jerr({ error: 'watermark_failed', detail: String(e).slice(0,200) }, 500); }

  return new Response(output, {
    status: 200,
    headers: {
      ...CORS,
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${slug}.pdf"`,
      'Cache-Control': 'private, no-store',
      'X-Frame-Options': 'SAMEORIGIN',
    },
  });
});
