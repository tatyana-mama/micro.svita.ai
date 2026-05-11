// shop-advisor — public AI concierge for the micro.svita.ai catalog.
// Anonymous, anyone browsing /shop.html can ask "help me pick a concept" and the
// model recommends ONLY items that actually exist in `concepts_catalog`.
//
// Constraints baked in:
//   • Catalog snapshot is loaded server-side and inlined into the system prompt,
//     so the model can't invent slugs or claim a concept exists when it doesn't.
//   • Conversation context (`history`) is bounded to keep a rate-limit story.
//   • Replies are short, opinionated, and end with concept slugs the visitor
//     can click straight on the shop.
//
// LLM routing:
//   Default provider = `ollama` (Jetson qwen2.5:14b via Tailscale Funnel).
//   Override with LLM_PROVIDER=anthropic to use Claude if a credited
//   ANTHROPIC_API_KEY is set.
//
// Deploy:
//   supabase functions deploy shop-advisor --project-ref ctdleobjnzniqkqomlrq --no-verify-jwt
// Secrets:
//   LLM_PROVIDER      ollama | anthropic   (default: ollama)
//   LLM_ENDPOINT      e.g. https://scyraai-desktop-1.tail2060da.ts.net:8443
//   LLM_MODEL         e.g. qwen2.5:14b-instruct-q4_K_M
//   ANTHROPIC_API_KEY (only when LLM_PROVIDER=anthropic)
//   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (auto-injected)

import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const LLM_PROVIDER = (Deno.env.get('LLM_PROVIDER') ?? 'ollama').toLowerCase();
const LLM_ENDPOINT = (Deno.env.get('LLM_ENDPOINT') ?? '').replace(/\/+$/, '');
const LLM_MODEL = Deno.env.get('LLM_MODEL') ?? 'qwen2.5:14b-instruct-q4_K_M';
const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
const ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false },
});

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

interface CatalogRow {
  slug: string;
  name: string | null;
  category: string | null;
  country: string | null;
  size_m2: number | null;
  price_eur: number | null;
  budget_eur: number | null;
  tagline: string | null;
}

let catalogCache: { ts: number; rows: CatalogRow[] } | null = null;
const CATALOG_TTL_MS = 60_000;

async function loadCatalog(): Promise<CatalogRow[]> {
  const now = Date.now();
  if (catalogCache && now - catalogCache.ts < CATALOG_TTL_MS) {
    return catalogCache.rows;
  }
  const { data, error } = await admin
    .from('concepts_catalog')
    .select('slug,name,category,country,size_m2,price_eur,budget_eur,tagline')
    .eq('is_active', true)
    .order('slug');
  if (error) throw new Error(`catalog_query_failed: ${error.message}`);
  const rows = (data ?? []) as CatalogRow[];
  catalogCache = { ts: now, rows };
  return rows;
}

function buildSystemPrompt(rows: CatalogRow[]): string {
  const total = rows.length;
  const cats = [...new Set(rows.map(r => r.category).filter(Boolean))].sort();
  const countries = [...new Set(rows.map(r => r.country).filter(Boolean))].sort();
  const lines = rows
    .map(r => {
      const price = r.price_eur ? `€${r.price_eur}` : '—';
      const budget = r.budget_eur ? `~€${r.budget_eur.toLocaleString('en-US')}` : '—';
      return `- ${r.slug} | ${r.name ?? r.slug} | ${r.category ?? '—'} | ${r.country ?? '—'} | ${r.size_m2 ?? '—'}m² | brandbook ${price} | open-budget ${budget}`;
    })
    .join('\n');

  return `You are micro.svita's catalog concierge.

micro.svita.ai sells brandbooks for ready-to-launch micro-businesses across Europe — boutique cafés, ateliers, repair studios, juice labs, watch shops, etc. Each concept ships as a 25-slide editorial PDF (palette, interior axonometry, signage, menu, CAPEX in EUR, 4-week opening plan) for €49 (Concept) or €149 (Exclusive — concept removes from catalogue forever, full commercial rights).

YOUR JOB
- Help a visitor pick ONE concept that fits their constraints (budget to open the business, city, category, scale, vibe).
- Recommend only concepts from the catalog snapshot below. Never invent a concept that isn't listed.
- When you suggest a concept, always include its slug in this exact format on its own line: \`→ /shop.html?concept=<slug>\`
- Stay short: 3–6 sentences max per turn. The user is on a phone or laptop while browsing.
- If the user is unsure, ask ONE clarifying question (budget? city? category?). Don't bombard.
- If nothing in the catalog matches, say so honestly and propose the closest two.
- Speak the user's language (English, Polish, Ukrainian, Belarusian, Russian — whichever they used).

CATALOG SNAPSHOT (${total} concepts, ${cats.length} categories, ${countries.length} countries)

Categories: ${cats.join(', ')}
Countries: ${countries.join(', ')}

CONCEPTS (slug | name | category | country | size | brandbook price | open-business budget):
${lines}

PRICING NOTE
The €49 / €149 price you quote is what the visitor pays today on micro.svita.ai for the brandbook. The open-budget column is roughly what they'd then spend to open the actual business based on the brandbook's CAPEX — that's the bigger number, and it varies per concept.

DO NOT
- Don't claim a concept exists if it isn't in the list.
- Don't invent prices or budgets — quote only the columns above.
- Don't pitch alternatives outside micro.svita (other websites, franchises, generic templates).
- Don't ask for personal data; this chat is anonymous.`;
}

interface Msg { role: 'user' | 'assistant'; content: string; }

async function callAnthropic(system: string, turns: Msg[]) {
  if (!ANTHROPIC_KEY) {
    return { ok: false, status: 503, body: 'anthropic_not_configured' };
  }
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 600,
      temperature: 0.4,
      system,
      messages: turns,
    }),
  });
  if (!r.ok) return { ok: false, status: r.status, body: await r.text() };
  const data = await r.json();
  return { ok: true, reply: (data?.content?.[0]?.text ?? '').trim(), model: ANTHROPIC_MODEL };
}

async function callOllama(system: string, turns: Msg[]) {
  if (!LLM_ENDPOINT) {
    return { ok: false, status: 503, body: 'llm_endpoint_not_configured' };
  }
  // Ollama exposes OpenAI-compatible /v1/chat/completions.
  const r = await fetch(`${LLM_ENDPOINT}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: LLM_MODEL,
      temperature: 0.4,
      max_tokens: 600,
      stream: false,
      messages: [
        { role: 'system', content: system },
        ...turns,
      ],
    }),
  });
  if (!r.ok) return { ok: false, status: r.status, body: await r.text() };
  const data = await r.json();
  const reply = (data?.choices?.[0]?.message?.content ?? '').trim();
  return { ok: true, reply, model: LLM_MODEL };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  let body: { message?: string; history?: Msg[] };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'bad_json' }, 400);
  }
  const message = String(body.message ?? '').trim();
  if (!message) return json({ error: 'empty_message' }, 400);
  if (message.length > 1500) return json({ error: 'message_too_long' }, 413);

  const history = Array.isArray(body.history) ? body.history.slice(-12) : [];
  const turns: Msg[] = [
    ...history
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map(m => ({ role: m.role, content: m.content.slice(0, 2000) })),
    { role: 'user', content: message },
  ];

  let system: string;
  try {
    const rows = await loadCatalog();
    system = buildSystemPrompt(rows);
  } catch (e) {
    return json({ error: 'catalog_unavailable', detail: String(e) }, 503);
  }

  // Primary provider, with cross-fallback if it fails. Default = ollama;
  // anthropic is opt-in via LLM_PROVIDER=anthropic.
  const primary  = LLM_PROVIDER === 'anthropic' ? callAnthropic : callOllama;
  const fallback = LLM_PROVIDER === 'anthropic' ? callOllama   : callAnthropic;

  let res = await primary(system, turns);
  let provider = LLM_PROVIDER;
  if (!res.ok) {
    const alt = await fallback(system, turns);
    if (alt.ok) {
      res = alt;
      provider = LLM_PROVIDER === 'anthropic' ? 'ollama' : 'anthropic';
    } else {
      return json({
        error: 'upstream_error',
        primary:  { provider: LLM_PROVIDER, status: res.status, body: res.body },
        fallback: { status: alt.status, body: alt.body },
      }, 502);
    }
  }
  return json({ reply: res.reply, model: res.model, provider });
});
