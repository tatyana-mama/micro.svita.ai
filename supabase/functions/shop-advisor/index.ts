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
      const budget = r.budget_eur ? `~€${r.budget_eur.toLocaleString('en-US')}` : '—';
      return `- ${r.slug} | ${r.name ?? r.slug} | ${r.category ?? '—'} | ${r.country ?? '—'} | ${r.size_m2 ?? '—'}m² | open-budget ${budget}`;
    })
    .join('\n');

  return `You are micro.svita's catalog concierge.

micro.svita.ai is a SUBSCRIPTION library of ready-to-launch micro-businesses across Europe — boutique cafés, bars, ateliers, repair studios, juice labs, watch shops, etc. Each concept ships as a 25-slide editorial PDF (palette, interior axonometry, signage, menu, CAPEX in EUR, 4-week opening plan).

PRICING (this is the ONLY pricing — there is no per-concept fee)
- $19 / month  OR  $149 / year (save ~35%)
- 7-day free trial · cancel anytime · taxes added at checkout where applicable
- ONE subscription unlocks the WHOLE library — every concept, every update, no per-concept paywalls
- NEVER mention €49, €149-per-concept, or "buy this brandbook" — that pricing model was retired

ALWAYS include the subscription price ($19/mo or $149/yr) when the user asks ANY pricing question. Do not just say "subscription model" — give the numbers.

EXAMPLES of good pricing answers (in the visitor's language)

User: "сколько стоит?"  →  "$19 в месяц или $149 в год (экономия ~35%). 7 дней бесплатно, отменить можно в любой момент. Подписка открывает всю библиотеку — 94+ концепции, не нужно платить за каждую отдельно."

User: "how much?"  →  "$19 / month or $149 / year (≈35% off). 7-day free trial, cancel anytime. One subscription unlocks the whole library — 94+ concepts, no per-concept fees."

User: "сколько стоит концепция бара?"  →  "Отдельно концепция уже не продаётся — мы перешли на подписку: $19/мес или $149/год, 7 дней бесплатно. Открывает ВСЕ концепции, не только бар. Чтобы открыть сам бар физически, нужно ~€10-25k (зависит от концепции)."

YOUR JOB
- Help a visitor pick ONE concept that fits their constraints (budget to OPEN the business, city, category, scale, vibe). The open-business budget is what they'd spend to actually launch — that's the big number, NOT the subscription price.
- Recommend only concepts from the catalog snapshot below. Never invent a concept that isn't listed.
- When you suggest a concept, always include its slug in this exact format on its own line: \`→ /shop.html?concept=<slug>\`
- Stay short: 3–6 sentences max per turn. The user is on a phone or laptop while browsing.
- If the user is unsure, ask ONE clarifying question (budget? city? category?). Don't bombard.
- If nothing in the catalog matches, say so honestly and propose the closest two.
- If the visitor asks "how much does this cost?", answer with the subscription ($19/mo or $149/yr, 7-day trial). DO NOT quote per-concept prices.
- Speak the user's language (English, Polish, Ukrainian, Belarusian, Russian — whichever they used).

CATALOG SNAPSHOT (${total} concepts, ${cats.length} categories, ${countries.length} countries)

Categories: ${cats.join(', ')}
Countries: ${countries.join(', ')}

CONCEPTS (slug | name | category | country | size | open-business budget):
${lines}

DO NOT
- Don't claim a concept exists if it isn't in the list.
- Don't invent budgets — quote only the open-budget column above.
- Don't mention any per-concept price (€49, €149, "Concept tier", "Exclusive tier") — these were retired with the subscription pivot.
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

// Detect price questions and serve a deterministic answer — local LLMs
// hallucinate $49 / €49 despite explicit instructions. The canonical pricing
// is too important to leave to the model.
function detectLanguage(msg: string): 'ru' | 'pl' | 'uk' | 'be' | 'en' {
  const m = msg.toLowerCase();
  if (/[а-яё]/.test(m)) {
    if (/(ска|так|тра|які|якія|так|колькі|мова|вёска|годзе)/.test(m)) return 'be';
    if (/(скільки|ціна|вартість|підписк|кошту)/.test(m)) return 'uk';
    return 'ru';
  }
  if (/[ąćęłńóśźż]/.test(m) || /(ile|cena|kosztuje|subskrypcja)/.test(m)) return 'pl';
  return 'en';
}
function isPriceQuestion(msg: string): boolean {
  const m = msg.toLowerCase();
  return /(сколько|скільки|колькі|how much|ile|cena|ціна|вартість|cost|price|стоит|стоить|кошту|стоимость|подписк|subscription|плати|pay|tariff)/.test(m);
}
const PRICING_REPLY: Record<string, string> = {
  ru: '**$19 в месяц** или **$149 в год** (экономия ~35%). 7 дней бесплатно · отменить можно в любой момент. Одна подписка открывает ВСЮ библиотеку — 94+ концепций, никаких отдельных платежей за каждый проект. Открыть бизнес физически = отдельный бюджет на ремонт/оборудование (от ~€10k до ~€25k, зависит от концепции).',
  uk: '**$19 на місяць** або **$149 на рік** (≈35% знижки). 7 днів безкоштовно · скасувати можна будь-коли. Одна підписка відкриває ВСЮ бібліотеку — 94+ концепцій. Відкрити сам бізнес фізично = окремий бюджет (~€10k–€25k залежно від концепції).',
  be: '**$19 у месяц** ці **$149 у год** (≈35% эканоміі). 7 дзён бясплатна · адмяніць можна заўжды. Адна падпіска адчыняе ЎСЮ бібліятэку — 94+ канцэпцыі.',
  pl: '**$19 / miesiąc** lub **$149 / rok** (oszczędność ~35%). 7 dni gratis · anulujesz kiedy chcesz. Jedna subskrypcja otwiera CAŁĄ bibliotekę — 94+ koncepcji, bez opłat za każdą osobno.',
  en: '**$19 / month** or **$149 / year** (≈35% off). 7-day free trial · cancel anytime. One subscription unlocks the WHOLE library — 94+ concepts, no per-concept fees. Opening the actual business is a separate budget (~€10k–€25k depending on concept).',
};

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

  // Deterministic short-circuit for pricing questions.
  if (isPriceQuestion(message)) {
    const lang = detectLanguage(message);
    return json({ reply: PRICING_REPLY[lang], model: 'static-pricing', provider: 'override' });
  }

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
