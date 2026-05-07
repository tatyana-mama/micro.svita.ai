// ai-concept-chat — per-concept AI assistant.
// LLM: Ollama on Jetson (qwen2.5:14b) via Tailscale Funnel, OpenAI-compatible API.
// Only owners of the concept with tier IN ('ai','exclusive') can call it.
// Context is strictly the concept's brandbook.
//
// Deploy:
//   supabase functions deploy ai-concept-chat --project-ref ctdleobjnzniqkqomlrq
// Secrets:
//   LLM_ENDPOINT  e.g. https://scyraai-desktop-1.tail2060da.ts.net:8443
//   LLM_MODEL     e.g. qwen2.5:14b-instruct-q4_K_M
//   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (auto-injected)

import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const LLM_ENDPOINT = Deno.env.get('LLM_ENDPOINT') ?? '';
const LLM_MODEL = Deno.env.get('LLM_MODEL') ?? 'qwen2.5:14b-instruct-q4_K_M';
const BRANDBOOK_BASE = 'https://micro.svita.ai/data/concepts';

const admin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  { auth: { persistSession: false } },
);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchBrandbook(slug: string): Promise<string> {
  const url = `${BRANDBOOK_BASE}/${slug}/${slug}-brandbook.html`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`brandbook_not_found:${r.status}`);
  const html = await r.text();
  return stripHtml(html).slice(0, 60_000);
}

interface Msg { role: 'user' | 'assistant'; content: string; }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  if (!LLM_ENDPOINT) return json({ error: 'ai_not_configured' }, 503);

  const authHeader = req.headers.get('Authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return json({ error: 'unauthorized' }, 401);

  const { data: userRes, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userRes?.user) return json({ error: 'unauthorized' }, 401);
  const userId = userRes.user.id;

  let body: { slug?: string; message?: string; history?: Msg[] };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'bad_json' }, 400);
  }
  const slug = String(body.slug ?? '').trim().toLowerCase();
  const message = String(body.message ?? '').trim();
  const history = Array.isArray(body.history) ? body.history.slice(-10) : [];

  if (!/^[a-z0-9][a-z0-9-]{1,80}$/.test(slug)) return json({ error: 'bad_slug' }, 400);
  if (!message || message.length > 2000) return json({ error: 'bad_message' }, 400);

  const { data: purchase, error: pErr } = await admin
    .from('purchases')
    .select('tier, status')
    .eq('user_id', userId)
    .eq('concept_slug', slug)
    .eq('status', 'paid')
    .maybeSingle();
  if (pErr) return json({ error: 'db_error' }, 500);
  if (!purchase) return json({ error: 'not_owned' }, 403);
  if (purchase.tier !== 'ai' && purchase.tier !== 'exclusive') {
    return json({ error: 'ai_not_included', tier: purchase.tier }, 403);
  }

  const { data: concept } = await admin
    .from('concepts_catalog')
    .select('slug, name, category, country, size_m2, weeks, tagline')
    .eq('slug', slug)
    .maybeSingle();

  let brandbook: string;
  try {
    brandbook = await fetchBrandbook(slug);
  } catch (e) {
    console.error('brandbook fetch failed', slug, e);
    return json({ error: 'brandbook_unavailable' }, 502);
  }

  const name = concept?.name || slug;
  const systemPrompt = [
    `You are a concept-specific consultant for the micro-business concept "${name}" (${slug}).`,
    `Category: ${concept?.category ?? '—'}. Country: ${concept?.country ?? '—'}. Size: ${concept?.size_m2 ?? '—'} m². Setup: ${concept?.weeks ?? '—'} weeks.`,
    `Tagline: ${concept?.tagline ?? ''}`,
    ``,
    `RULES:`,
    `1. Answer ONLY from the brandbook below. Use concrete numbers when present (prices, timelines, square meters, revenue, margins).`,
    `2. If asked about something outside this concept (other cities, other businesses, weather, general coaching) — politely redirect to the concept.`,
    `3. If something isn't in the brandbook but is adjacent, you may extrapolate, but clearly say "this is my best inference from the brandbook, not a quoted figure".`,
    `4. Detect and mirror the user's language automatically (Russian, Belarusian, Ukrainian, English, Polish, Spanish, Italian, German, French, Portuguese, Japanese, Korean).`,
    `5. Tone: warm, professional, practical. Max 5 short paragraphs per answer.`,
    `6. Never promise specific legal, tax, or medical outcomes. Keep all statements framed as planning help.`,
    ``,
    `<BRANDBOOK>`,
    brandbook,
    `</BRANDBOOK>`,
  ].join('\n');

  const llmBody = {
    model: LLM_MODEL,
    max_tokens: 1024,
    temperature: 0.7,
    stream: false,
    messages: [
      { role: 'system', content: systemPrompt },
      ...history.map((m) => ({ role: m.role, content: String(m.content).slice(0, 4000) })),
      { role: 'user', content: message },
    ],
  };

  let answer = '';
  try {
    const r = await fetch(`${LLM_ENDPOINT.replace(/\/$/, '')}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(llmBody),
      signal: AbortSignal.timeout(120_000),
    });
    if (!r.ok) {
      const errText = await r.text();
      console.error('llm error', r.status, errText);
      return json({ error: 'ai_upstream', status: r.status }, 502);
    }
    const data = await r.json();
    answer = String(data?.choices?.[0]?.message?.content ?? '').trim();
  } catch (e) {
    console.error('llm fetch threw', e);
    return json({ error: 'ai_upstream_threw' }, 502);
  }

  return json({ answer, model: LLM_MODEL });
});
