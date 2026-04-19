// Rebuild Lemon Squeezy signed Custom Checkout URLs so that
// `checkout[custom][*]` query overrides pass signature validation.
//
// LS /checkout/custom/<uuid>?signature=<hmac> URLs seal the payload; adding
// any extra query (checkout[email], checkout[custom][*], success_url) returns
// 403 "Invalid signature". Solution: re-create each checkout via LS API with
// checkout_data.custom placeholders baked in, so the frontend can inject
// ref/concept_slug/user_id/tier at click-time without breaking the signature.

import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const LS_API_KEY_ENV = Deno.env.get('LEMONSQUEEZY_API_KEY') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const LS_API = 'https://api.lemonsqueezy.com/v1';

const CUSTOM_PLACEHOLDERS = { ref: '', concept_slug: '', user_id: '', tier: '' };

type CheckoutAttributes = {
  store_id: number;
  variant_id: number;
  custom_price: number | null;
  product_options: Record<string, unknown>;
  checkout_options: Record<string, unknown>;
  checkout_data: Record<string, unknown>;
  url: string;
  expires_at: string | null;
};

function extractCheckoutUuid(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/\/checkout\/custom\/([0-9a-f-]{36})/);
  return m ? m[1] : null;
}

async function lsFetch(path: string, apiKey: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${LS_API}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${apiKey}`,
      ...(init.headers ?? {}),
    },
  });
}

async function fetchCheckout(uuid: string, apiKey: string): Promise<{attrs: CheckoutAttributes|null; err: string|null}> {
  const res = await lsFetch(`/checkouts/${uuid}`, apiKey);
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    return { attrs: null, err: `${res.status} ${t.slice(0, 200)}` };
  }
  const body = await res.json();
  return { attrs: body?.data?.attributes ?? null, err: null };
}

async function createCheckout(src: CheckoutAttributes, apiKey: string): Promise<{url: string|null; err: string|null}> {
  const existingCustom = (src.checkout_data as { custom?: Record<string, unknown> })?.custom ?? {};
  const attributes: Record<string, unknown> = {
    product_options: src.product_options ?? {},
    checkout_options: src.checkout_options ?? {},
    checkout_data: {
      ...(src.checkout_data ?? {}),
      custom: { ...CUSTOM_PLACEHOLDERS, ...existingCustom },
    },
  };
  if (src.custom_price != null) attributes.custom_price = src.custom_price;

  const payload = {
    data: {
      type: 'checkouts',
      attributes,
      relationships: {
        store: { data: { type: 'stores', id: String(src.store_id) } },
        variant: { data: { type: 'variants', id: String(src.variant_id) } },
      },
    },
  };
  const res = await lsFetch('/checkouts', apiKey, { method: 'POST', body: JSON.stringify(payload) });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { url: null, err: `${res.status} ${text.slice(0, 300)}` };
  }
  const body = await res.json();
  return { url: body?.data?.attributes?.url ?? null, err: null };
}

type Row = {
  slug: string;
  name: string;
  ls_url: string | null;
  ls_url_ai: string | null;
  ls_url_exclusive: string | null;
};

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    });
  }
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const body = await req.json().catch(() => ({}));
  const apiKey: string = body.api_key || LS_API_KEY_ENV;
  const dryRun: boolean = Boolean(body.dry_run);
  const onlySlug: string | undefined = body.slug;
  const probe: boolean = Boolean(body.probe);

  if (probe) {
    return Response.json({
      ok: true,
      has_env_key: Boolean(LS_API_KEY_ENV),
      has_service_role: Boolean(SUPABASE_SERVICE_ROLE_KEY),
    });
  }

  if (!apiKey) {
    return Response.json({ ok: false, error: 'missing LEMONSQUEEZY_API_KEY (neither env nor body.api_key)' }, { status: 400 });
  }
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json({ ok: false, error: 'missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

  let q = supabase.from('concepts_catalog').select('slug,name,ls_url,ls_url_ai,ls_url_exclusive');
  if (onlySlug) q = q.eq('slug', onlySlug);
  const { data: allRows, error } = await q;
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });

  const rows = (allRows ?? []).filter((r: Row) => {
    return [r.ls_url, r.ls_url_ai, r.ls_url_exclusive].some((u) => typeof u === 'string' && u.includes('/checkout/custom/'));
  });

  const report: Array<Record<string, unknown>> = [];
  const updates: Array<{ slug: string; patch: Record<string, string | null> }> = [];

  for (const row of rows as Row[]) {
    const tierMap: Array<['ls_url' | 'ls_url_ai' | 'ls_url_exclusive', string]> = [
      ['ls_url', 'basic'],
      ['ls_url_ai', 'ai'],
      ['ls_url_exclusive', 'exclusive'],
    ];
    const patch: Record<string, string | null> = {};
    const detail: Record<string, unknown> = { slug: row.slug };

    for (const [field, tier] of tierMap) {
      const url = row[field];
      const uuid = extractCheckoutUuid(url);
      if (!uuid) { detail[tier] = 'skip'; continue; }

      const { attrs: src, err: fetchErr } = await fetchCheckout(uuid, apiKey);
      if (!src) { detail[tier] = `fetch_failed: ${fetchErr}`; continue; }

      if (dryRun) {
        detail[tier] = `would_rebuild variant=${src.variant_id} store=${src.store_id} price=${src.custom_price}`;
        continue;
      }

      const { url: fresh, err: createErr } = await createCheckout(src, apiKey);
      if (!fresh) { detail[tier] = `create_failed: ${createErr}`; continue; }
      patch[field] = fresh;
      detail[tier] = 'ok';
    }

    if (Object.keys(patch).length > 0 && !dryRun) {
      updates.push({ slug: row.slug, patch });
    }
    report.push(detail);
  }

  if (!dryRun && updates.length > 0) {
    for (const u of updates) {
      const { error: upErr } = await supabase.from('concepts_catalog').update(u.patch).eq('slug', u.slug);
      if (upErr) report.push({ slug: u.slug, db_error: upErr.message });
    }
  }

  return Response.json({
    ok: true,
    dry_run: dryRun,
    rows: rows.length,
    updated: updates.length,
    detail: report,
  });
});
