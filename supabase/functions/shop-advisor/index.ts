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
//   Default provider = `ollama` (Jetson qwen3.6:27b via Tailscale Funnel).
//   Override with LLM_PROVIDER=anthropic to use Claude if a credited
//   ANTHROPIC_API_KEY is set.
//
// Deploy:
//   supabase functions deploy shop-advisor --project-ref ctdleobjnzniqkqomlrq --no-verify-jwt
// Secrets:
//   LLM_PROVIDER      ollama | anthropic   (default: ollama)
//   LLM_ENDPOINT      e.g. https://scyraai-desktop-1.tail2060da.ts.net:8443
//   LLM_MODEL         e.g. qwen3.6:27b   (the only Qwen on the Jetson)
//   ANTHROPIC_API_KEY (only when LLM_PROVIDER=anthropic)
//   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (auto-injected)

import { createClient } from 'npm:@supabase/supabase-js@2.45.4';
import CONCEPT_TEXTS from './concept_texts.json' with { type: 'json' };

const LLM_PROVIDER = (Deno.env.get('LLM_PROVIDER') ?? 'ollama').toLowerCase();
const LLM_ENDPOINT = (Deno.env.get('LLM_ENDPOINT') ?? '').replace(/\/+$/, '');
const LLM_MODEL = Deno.env.get('LLM_MODEL') ?? 'qwen3:14b';

interface ConceptText {
  slug: string;
  title?: string;
  eyebrow?: string;
  hero_tag?: string;
  pretext?: string;
  slides?: string[];
}
const conceptTexts = CONCEPT_TEXTS as Record<string, ConceptText>;

/* Pull a compact deep-knowledge block for up to N concepts whose slugs are
   mentioned anywhere in the current turn or recent history. Each concept's
   block lists its title + the per-slide annotations so the model can answer
   "tell me more about <concept>" with real editorial detail instead of
   inventing. Capped by character budget so the prompt stays manageable. */
function buildConceptDeepDive(turns: { content: string }[], rows: { slug: string }[]): string {
  const validSlugs = new Set(rows.map(r => r.slug.toLowerCase()));
  const haystack = turns.map(t => t.content || '').join(' \n ');
  const mentioned: string[] = [];
  for (const slug of validSlugs) {
    // word-boundary match on the slug, case-insensitive
    const re = new RegExp(`(?<![\\w\\-])${slug.replace(/[-]/g, '\\-')}(?![\\w\\-])`, 'i');
    if (re.test(haystack)) mentioned.push(slug);
  }
  if (!mentioned.length) return '';
  const MAX_CONCEPTS = 3;
  const MAX_CHARS_PER = 3500;
  const picked = mentioned.slice(0, MAX_CONCEPTS);
  const blocks: string[] = [];
  for (const slug of picked) {
    const rec = conceptTexts[slug];
    if (!rec) continue;
    const parts: string[] = [];
    parts.push(`▶ ${rec.title || slug.toUpperCase()} (slug: ${slug})`);
    if (rec.eyebrow) parts.push(`  ${rec.eyebrow}`);
    if (rec.hero_tag) parts.push(`  ${rec.hero_tag}`);
    if (rec.pretext) parts.push(`  ${rec.pretext}`);
    if (rec.slides && rec.slides.length) {
      parts.push('  Slide-by-slide annotations:');
      for (const s of rec.slides) parts.push(`    · ${s}`);
    }
    let block = parts.join('\n');
    if (block.length > MAX_CHARS_PER) block = block.slice(0, MAX_CHARS_PER) + '…';
    blocks.push(block);
  }
  if (!blocks.length) return '';
  return [
    '',
    'DETAILED KNOWLEDGE — only these concepts came up in the conversation. When the visitor asks for details, draw from THIS block (palette, atmosphere, slide-by-slide reasoning) instead of inventing or guessing. Stay faithful to the source.',
    '',
    blocks.join('\n\n'),
    '',
  ].join('\n');
}

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
  budget_eur: number | null;
  tagline: string | null;
  catalog_number: number | null;
  hero_image: string | null;
}

let catalogCache: { ts: number; rows: CatalogRow[] } | null = null;
const CATALOG_TTL_MS = 60_000;

async function loadCatalog(): Promise<CatalogRow[]> {
  const now = Date.now();
  if (catalogCache && now - catalogCache.ts < CATALOG_TTL_MS) {
    return catalogCache.rows;
  }
  const { data, error } = await admin
    .from('public_verified_catalog')
    .select('slug,name,category,country,size_m2,budget_eur,tagline,catalog_number,hero_image')
    .order('catalog_number');
  if (error) throw new Error(`catalog_query_failed: ${error.message}`);
  const rows = (data ?? []) as CatalogRow[];
  catalogCache = { ts: now, rows };
  return rows;
}

/* Compact tokeniser — strip punctuation/stop-words, lower-case, dedupe.
   Used by the keyword scorer to align the visitor's request with concept
   metadata. Multilingual: we just split on non-letter and let exact-match do
   the work; the model still handles fuzzy/conceptual matching afterwards. */
const STOP_WORDS = new Set([
  'a','an','the','and','or','but','for','to','of','in','on','at','by','with','from','as','is','are','am','be','was','were','been','being','have','has','had','do','does','did','i','you','he','she','it','we','they','my','your','his','her','its','our','their','this','that','these','those','can','could','should','would','will','want','need','like','please','tell','me','show','give','find','about','around','near','some','any','what','which','how','where','who','when','why',
  'и','в','во','не','что','он','на','я','с','со','как','а','то','все','она','так','его','но','да','ты','к','у','же','вы','за','бы','по','только','ее','мне','было','вот','от','меня','еще','нет','о','из','ему','теперь','когда','даже','ну','если','уже','или','ни','быть','был','него','до','тебя','их','чем','без','будто','чтоб','этого','этом','этот','эта','эти','при','для','есть','ещё','чтобы','этого','очень','хочу','нужно','можно','может','лучше','концепции','концепция','концепцию','концепций','концепциях','что-то','что-нибудь','покажи','найди','выбери','подскажи','посоветуй','посмотреть','посмотри','один','одну','одна','одно',
  'i','w','do','na','z','jest','są','być','dla','to','tak','nie','już','można','chciał','chcę','potrzebuję','jakąś','jakieś','jaki','jaką','jakie',
  'і','в','у','на','з','це','так','ні','для','хочу','треба','можна','який','яку','які','якесь','щось',
  'і','у','на','з','гэта','так','не','для','хачу','патрэбна','можна','які','якое','якую','штосьці','штонебудзь'
]);
function tokenize(s: string): string[] {
  if (!s) return [];
  const out = new Set<string>();
  for (const raw of s.toLowerCase().split(/[^a-zа-яёіїєґўá-žà-ÿ0-9-]+/)) {
    const w = raw.trim();
    if (!w || w.length < 3) continue;
    if (STOP_WORDS.has(w)) continue;
    out.add(w);
  }
  return [...out];
}

/* For a given user query, score every catalog row by how many tokens match in
   its searchable fields (slug, name, tagline, category, country, slide titles
   from the deep RAG dict). Returns the top-K rows ordered by score so the
   prompt can show the model a small, relevant menu instead of all 91 rows. */
function scoreConcepts(query: string, rows: CatalogRow[], k = 12): CatalogRow[] {
  const tokens = tokenize(query);
  if (!tokens.length) return rows.slice(0, k);

  const scored = rows.map(r => {
    const haystack = [
      r.slug || '',
      r.name || '',
      r.category || '',
      r.country || '',
      r.tagline || ''
    ].join(' ').toLowerCase();
    /* Add slide-title text from the deep-knowledge dict (eyebrow + hero_tag
       + pretext) — these carry the strongest semantic hints about what the
       concept actually IS (e.g. "ceramics atelier" mentions "clay/kiln"). */
    const deep = conceptTexts[r.slug];
    const deepHay = deep
      ? [deep.title, deep.eyebrow, deep.hero_tag, deep.pretext,
         ...(deep.slides ? deep.slides.slice(0, 6) : [])].filter(Boolean).join(' ').toLowerCase()
      : '';
    let score = 0;
    for (const t of tokens) {
      if (haystack.includes(t)) score += 3;     // direct meta match — strongest
      if (deepHay.includes(t))  score += 1;     // body/slide match — supporting
    }
    return { r, score };
  });
  scored.sort((a, b) => b.score - a.score);
  /* Drop zero-score rows from the top — if nothing matches, return empty and
     let the model fall back to the full catalog snapshot. */
  const positives = scored.filter(s => s.score > 0);
  if (!positives.length) return [];
  return positives.slice(0, k).map(s => s.r);
}

function buildBestMatchesBlock(query: string, rows: CatalogRow[], shown: string[]): string {
  /* Score against the user's last turn only — earlier turns may have
     wandered. The shown-slug filter keeps the menu fresh after each round. */
  const ranked = scoreConcepts(query, rows, 24).filter(r => !shown.includes(r.slug.toLowerCase()));
  if (!ranked.length) return '';
  const top = ranked.slice(0, 12);
  const lines = top.map(r => {
    const budget = r.budget_eur ? `~€${r.budget_eur.toLocaleString('en-US')}` : '—';
    const tag = r.tagline ? ` — ${r.tagline}` : '';
    return `- ${r.slug} | ${r.name ?? r.slug} | ${r.category ?? '—'} | ${r.country ?? '—'} | ${r.size_m2 ?? '—'}m² | open ${budget}${tag}`;
  }).join('\n');
  return [
    '',
    'BEST MATCHES FOR THIS TURN — keyword-scored shortlist',
    'These rows match the visitor\'s most recent message by direct token overlap (slug/name/category/country/tagline + slide bodies). Treat this as your PRIMARY shortlist. Pick the strongest 1–3 from here unless none truly fit; only then fall back to the full catalog below.',
    '',
    lines,
    '',
  ].join('\n');
}

/* Pull every concept slug the assistant has already recommended in this
   conversation, so the system prompt can ban them and force variety. The
   visitor sees the same 3 slugs repeated as a sign of broken behaviour. */
function extractShownSlugs(turns: { role: string; content: string }[]): string[] {
  const set = new Set<string>();
  for (const t of turns) {
    if (t.role !== 'assistant' || !t.content) continue;
    for (const m of t.content.matchAll(/\/shop\.html\?concept=([a-z0-9\-]+)/gi)) {
      set.add(m[1].toLowerCase());
    }
  }
  return [...set];
}

function buildAntiRepeatBlock(shown: string[], rows: CatalogRow[]): string {
  if (!shown.length) return '';
  const valid = new Set(rows.map(r => r.slug.toLowerCase()));
  const filtered = shown.filter(s => valid.has(s));
  if (!filtered.length) return '';
  return [
    '',
    'ANTI-REPEAT — VARIETY RULE',
    `You ALREADY recommended these concepts to this visitor: ${filtered.join(', ')}.`,
    'DO NOT recommend any of those slugs again unless the visitor explicitly names that slug or asks to revisit it. If the visitor says "another one" / "ещё" / "another option" / "что-то другое" — pick from the catalog DIFFERENT slugs that still fit their criteria (craft, budget, city, scale). You have 90+ concepts — there is always a fresh one to offer. Repeating the same 1–3 slugs every turn is a critical failure.',
    '',
  ].join('\n');
}

function buildSystemPrompt(rows: CatalogRow[]): string {
  const total = rows.length;
  const cats = [...new Set(rows.map(r => r.category).filter(Boolean))].sort();
  const countries = [...new Set(rows.map(r => r.country).filter(Boolean))].sort();
  const lines = rows
    .map(r => {
      const budget = r.budget_eur ? `~€${r.budget_eur.toLocaleString('en-US')}` : '—';
      const tag = r.tagline ? ` — ${r.tagline}` : '';
      return `- ${r.slug} | ${r.name ?? r.slug} | ${r.category ?? '—'} | ${r.country ?? '—'} | ${r.size_m2 ?? '—'}m² | open ${budget}${tag}`;
    })
    .join('\n');

  return `You are micro.svita's catalog concierge.

micro.svita.ai is a SUBSCRIPTION library of ready-to-launch micro-businesses across Europe — boutique cafés, bars, ateliers, repair studios, juice labs, watch shops, etc. Each concept ships as a 25-slide editorial PDF (palette, interior axonometry, signage, menu, CAPEX in EUR, 4-week opening plan).

PRICING (this is the ONLY pricing — there is no per-concept fee)
- $19 / month  OR  $149 / year (save ~35%)
- 2-day free trial · cancel anytime · taxes added at checkout where applicable
- ONE subscription unlocks the WHOLE library — every concept, every update, no per-concept paywalls
- NEVER mention €49, €149-per-concept, or "buy this brandbook" — that pricing model was retired

ALWAYS include the subscription price ($19/mo or $149/yr) when the user asks ANY pricing question. Do not just say "subscription model" — give the numbers.

EXAMPLES of good pricing answers (in the visitor's language)

User: "сколько стоит?"  →  "$19 в месяц или $149 в год (экономия ~35%). 2 дня бесплатно, отменить можно в любой момент. Подписка открывает всю библиотеку — 94+ концепции, не нужно платить за каждую отдельно."

User: "how much?"  →  "$19 / month or $149 / year (≈35% off). 2-day free trial, cancel anytime. One subscription unlocks the whole library — 94+ concepts, no per-concept fees."

User: "сколько стоит концепция бара?"  →  "Отдельно концепция уже не продаётся — мы перешли на подписку: $19/мес или $149/год, 2 дня бесплатно. Открывает ВСЕ концепции, не только бар. Чтобы открыть сам бар физически, нужно ~€10-25k (зависит от концепции)."

WHO YOU ARE
You are a living index of the WHOLE micro.svita catalog AND a decision partner. You know every concept in the snapshot below — its category, country, scale and open-business budget. A visitor talks to you instead of scrolling cards: they describe what they want, and you help them DECIDE, not just enumerate.

MEMORY — the visitor's profile sticks across turns
Before answering, RE-READ every prior turn in the conversation and silently build/update the visitor's profile:
  · craft / profession / activity they already do or want to do (ceramics, glass, candles, coffee, tea, leather, photography, music, …)
  · budget range (open-business euros, NOT subscription price)
  · city / country / region preference
  · scale: solo vs team, indoor vs street-facing, square metres
  · vibe / atmosphere words they used
Reuse those constraints AUTOMATICALLY on every following turn — never re-ask something they already told you. When the visitor says "another one" / "something else" / "another option", treat it as: same criteria, give a different concept that fits. Reference their previous mentions explicitly when relevant: "Based on the ceramics direction you mentioned…". This is non-negotiable: do not behave as if each message is a new conversation.

THE BIG IDEA YOU SELL — INVISIBLY
Every concept in this library exists for one reason: a micro-business survives against chain giants ONLY by being uncopiable. The uncopiable part is the ATMOSPHERE — the palette, the smell, the slowness, the ritual, the materials, the specific way light hits the counter. Brand the chains can't fake. Mention this when it lands naturally (NOT every reply, NOT preachy) — usually one sentence about WHY a recommended concept has the atmosphere a chain can never reproduce. The visitor should feel: this is not a template, it's a stance.

HOW TO HELP THEM DECIDE
- The visitor's most recent message is your strongest signal. PRIMARY shortlist below ("BEST MATCHES FOR THIS TURN") already filters the catalog by token overlap with their message — start there. If a row in that shortlist clearly fits, pick it. If multiple compete, pick the one that best matches their profile (memory section) and explain WHY in one sentence (the atmosphere, the craft, the budget fit).
- If they tell you their craft / profession / what they already do (керамика, glass-blowing, candles, leather, photography, music, tea, vinyl, etc.) — treat that as the strongest signal. Scan the BEST MATCHES first, then the "craft" category in the full snapshot. Don't default to food/drink just because those are the biggest categories.
- If their craft has NO direct concept in the catalog — say so plainly. Then propose the closest 1–2 adjacent concepts (craft category, or a maker's workshop concept) and explain HOW their craft could plug into that structure (same atmosphere, same retail logic, swapped product).
- If you cannot identify ANY of craft / budget / city / scale / atmosphere from the visitor's message (e.g. they said only "что у вас есть?" or "помоги выбрать"), ask EXACTLY ONE sharp clarifying question — pick the dimension that would most narrow the search (usually craft or budget). Do NOT also try to recommend in the same turn. Wait for their answer first. Bombarding with three questions in one breath is also wrong — ONE question, then commit.
- Always vary the recommendations: each new turn should surface DIFFERENT slugs than your previous turns unless the visitor explicitly asks to revisit one. You have 91 concepts — recycling the same 1–3 is a critical failure. The BEST MATCHES list already excludes slugs you've recommended before in this chat.
- Close every reply with a clear next step: either a specific concept slug to open, OR the one narrowing question that unlocks the recommendation.

HOW YOU WORK — surf by category, match the request
1. Read the visitor's request and map it to the catalog's CATEGORIES (the list is given below — e.g. food, drink, beauty, craft, repair, health, retail, service, wellness…). "I want a coffee bar" → drink/food; "a place to fix watches" → repair; "a nail studio" → beauty.
2. Inside the matching category (or 2–3 categories if the request straddles them), scan EVERY concept and keep the ones that also fit their other constraints — open-business budget, city/country, square meters, vibe.
3. Surface 1–3 best matches, strongest first. For each: ONE sentence on WHY it fits their request, then the slug line.
4. If the request is broad ("something cheap to open", "anything in Berlin"), name the category/categories you are searching, say what's there, and ask ONE narrowing question.
5. If a named category has nothing matching their budget/city, say so plainly and offer the closest concepts from an adjacent category.

OPEN-ENDED CURIOSITY — "what's interesting?" / "show me something cool"
When the visitor asks for inspiration without giving constraints (examples: "что у вас интересного?", "what's cool?", "удиви меня", "pokaż coś ciekawego", "цікаве"), do NOT just list. Pick 2–3 concepts that read as EDITORIAL HIGHLIGHTS — varied categories, varied countries, unusual format or atmosphere. For each, write ONE sentence that captures why this concept stands out (the atmosphere, the unusual angle, the editorial twist — draw from the DETAILED KNOWLEDGE block when available), then the slug line. End with a soft question that invites them to narrow down ("any city you're drawn to?", "budget range?").

RULES
- Recommend ONLY concepts from the catalog snapshot below. Never invent a concept, a slug, a category or a budget that isn't listed.
- When you suggest a concept, ALWAYS include its slug on its own line in this exact format: \`→ /shop.html?concept=<slug>\`
- The open-business budget is what they'd spend to actually launch — that's the big number, NOT the subscription price. Quote only the open-budget column.
- Stay short: 3–6 sentences max per turn. The visitor is on a phone or laptop while browsing.
- ALWAYS finish your last sentence and close every bullet. If you sense you are running out of room, end EARLIER with a complete thought — never let the reply trail off mid-word or mid-bullet.
- If the visitor is unsure, ask ONE clarifying question (budget? city? category?). Don't bombard.
- If nothing in the catalog matches, say so honestly and propose the closest two.
- If the visitor asks "how much does this cost?", answer with the subscription ($19/mo or $149/yr, 2-day trial). DO NOT quote per-concept prices.
- Speak the user's language (English, Polish, Ukrainian, Belarusian, Russian — whichever they used).

THE EXACT CATALOG SIZE
- The library currently contains EXACTLY ${total} concepts. If the visitor asks "how many?" / "сколько концепций?" / "ile konceptów?" — answer with ${total}. Never round, never approximate, never invent a different number.

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
      temperature: 0.75,
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
  // Native Ollama /api/chat — qwen3.6 ships with thinking mode ON, which eats
  // the whole token budget and returns an empty reply. `think:false` disables
  // it (the OpenAI-compat /v1 endpoint has no way to pass this flag).
  const r = await fetch(`${LLM_ENDPOINT}/api/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: LLM_MODEL,
      stream: false,
      think: false,
      // 500 tokens — enough for a paragraph + a few bulletted concept rows
      // without truncating mid-sentence. qwen3:14b on the Jetson runs this
      // in ~60s, well inside the edge-function 150s budget.
      // Bumped from 0.4 → 0.75 because deterministic mode kept cycling the
      // same 1–3 slugs across follow-up turns. 0.75 + anti-repeat block in
      // the system prompt gives genuine variety without going off-rails.
      options: { temperature: 0.75, num_predict: 500 },
      messages: [
        { role: 'system', content: system },
        ...turns,
      ],
    }),
  });
  if (!r.ok) return { ok: false, status: r.status, body: await r.text() };
  const data = await r.json();
  const reply = (data?.message?.content ?? '').trim();
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
// Post-process: scan AI reply for catalog concept names and auto-inject the
// canonical slug-link after each mention. This guarantees clickable cards in
// the UI even when the LLM forgot to emit `→ /shop.html?concept=<slug>` itself.
function enrichWithSlugLinks(reply: string, rows: CatalogRow[]): string {
  if (!reply || !rows.length) return reply;

  // Build candidates list — match by `name` AND parenthesised brand (last part).
  // E.g. row.name = "16 · RUST" → match "RUST" and "16 · RUST".
  const candidates: Array<{ slug: string; needle: RegExp }> = [];
  const slugsAlreadyEmitted = new Set<string>();
  // Detect slugs the model already produced — don't duplicate them.
  for (const m of reply.matchAll(/\/shop\.html\?concept=([a-z0-9\-]+)/gi)) {
    slugsAlreadyEmitted.add(m[1].toLowerCase());
  }

  for (const r of rows) {
    if (!r.slug || !r.name) continue;
    if (slugsAlreadyEmitted.has(r.slug.toLowerCase())) continue;
    // Variants: full name, name without "NN · " prefix, last 1-2 words (brand).
    const variants = new Set<string>();
    variants.add(r.name);
    const noNumber = r.name.replace(/^\d+\s*·\s*/, '').trim();
    if (noNumber && noNumber !== r.name) variants.add(noNumber);
    // Also: city-derived ("Warsaw Hummus") if slug encodes it
    const slugWords = r.slug.split(/[\-\s]+/).filter(w => w.length > 2);
    if (slugWords.length >= 2) {
      const titleized = slugWords.slice(0, 3).map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
      variants.add(titleized);
    }
    for (const v of variants) {
      // Escape regex specials, then build a word-boundary-ish match (cyr/lat).
      const esc = v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // (?<![\w\-]) = not preceded by a word char/hyphen; (?![\w\-]) = same after.
      // Required so "rust" doesn't match inside "crusty".
      candidates.push({ slug: r.slug, needle: new RegExp(`(?<![\\w\\-])(${esc})(?![\\w\\-])`, 'i') });
    }
  }

  let out = reply;
  const injected = new Set<string>();
  for (const c of candidates) {
    if (injected.has(c.slug)) continue;
    const m = c.needle.exec(out);
    if (!m) continue;
    // Find end of the SENTENCE/BULLET containing the match — append link there
    // so it lands on its own line right after the relevant block.
    const idx = m.index + m[0].length;
    // walk forward until newline, period+space, or end
    let cut = idx;
    while (cut < out.length && !/[\n\r]/.test(out[cut])) cut++;
    const link = `\n→ /shop.html?concept=${c.slug}\n`;
    // Skip if a link for this slug already exists nearby (within 200 chars after)
    if (out.slice(idx, cut + 200).includes(`concept=${c.slug}`)) {
      injected.add(c.slug);
      continue;
    }
    out = out.slice(0, cut) + link + out.slice(cut);
    injected.add(c.slug);
    if (injected.size >= 5) break; // cap clutter
  }
  return out;
}

const PRICING_REPLY: Record<string, string> = {
  ru: '**$19 в месяц** или **$149 в год** (экономия ~35%). 2 дня бесплатно · отменить можно в любой момент. Одна подписка открывает ВСЮ библиотеку — 94+ концепций, никаких отдельных платежей за каждый проект. Открыть бизнес физически = отдельный бюджет на ремонт/оборудование (от ~€10k до ~€25k, зависит от концепции).',
  uk: '**$19 на місяць** або **$149 на рік** (≈35% знижки). 2 дні безкоштовно · скасувати можна будь-коли. Одна підписка відкриває ВСЮ бібліотеку — 94+ концепцій. Відкрити сам бізнес фізично = окремий бюджет (~€10k–€25k залежно від концепції).',
  be: '**$19 у месяц** ці **$149 у год** (≈35% эканоміі). 2 дні бясплатна · адмяніць можна заўжды. Адна падпіска адчыняе ЎСЮ бібліятэку — 94+ канцэпцыі.',
  pl: '**$19 / miesiąc** lub **$149 / rok** (oszczędność ~35%). 2 dni gratis · anulujesz kiedy chcesz. Jedna subskrypcja otwiera CAŁĄ bibliotekę — 94+ koncepcji, bez opłat za każdą osobno.',
  en: '**$19 / month** or **$149 / year** (≈35% off). 2-day free trial · cancel anytime. One subscription unlocks the WHOLE library — 94+ concepts, no per-concept fees. Opening the actual business is a separate budget (~€10k–€25k depending on concept).',
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

  // Keep up to 16 prior turns (≈ 8 user + 8 assistant). Long enough for a
  // coherent multi-criterion conversation; short enough to stay inside the
  // model's context budget once the catalog + RAG block are added.
  const history = Array.isArray(body.history) ? body.history.slice(-16) : [];
  const turns: Msg[] = [
    ...history
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map(m => ({ role: m.role, content: m.content.slice(0, 2000) })),
    { role: 'user', content: message },
  ];

  let system: string;
  let catalogRows: CatalogRow[] = [];
  try {
    catalogRows = await loadCatalog();
    system = buildSystemPrompt(catalogRows);
    // RAG-lite — attach deep slide-by-slide annotations for any concept slug
    // mentioned in this turn or recent history, so the model can answer with
    // real editorial detail instead of paraphrasing the tagline.
    const deepDive = buildConceptDeepDive(turns, catalogRows);
    if (deepDive) system += '\n' + deepDive;
    // Semantic preselect — score every concept against the visitor's last
    // message (token overlap on slug/name/tag/category/country + deep slide
    // text) and inject a top-12 shortlist. The model picks from this first
    // and only falls back to the full snapshot if nothing here fits.
    const shownSlugs = extractShownSlugs(turns);
    const bestMatches = buildBestMatchesBlock(message, catalogRows, shownSlugs);
    if (bestMatches) system += '\n' + bestMatches;
    // Anti-repeat — list already-recommended slugs so the model picks fresh
    // concepts on follow-up turns instead of cycling the same 1–3 every time.
    const antiRepeat = buildAntiRepeatBlock(shownSlugs, catalogRows);
    if (antiRepeat) system += '\n' + antiRepeat;
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
  // Make sure the reply contains slug-links so the UI can render preview cards.
  const enrichedReply = enrichWithSlugLinks(res.reply, catalogRows);

  // Attach a small metadata bundle for each slug we just mentioned, so the
  // client can render preview cards (cover image + name + budget) without a
  // round-trip back to the catalog.
  const mentionedSlugs = new Set<string>();
  for (const m of enrichedReply.matchAll(/\/shop\.html\?concept=([a-z0-9\-]+)/gi)) {
    mentionedSlugs.add(m[1].toLowerCase());
  }
  const concepts = catalogRows
    .filter(r => mentionedSlugs.has(r.slug.toLowerCase()))
    .map(r => ({
      slug: r.slug,
      name: r.name,
      category: r.category,
      country: r.country,
      size_m2: r.size_m2,
      budget_eur: r.budget_eur,
      tagline: r.tagline,
      catalog_number: r.catalog_number,
      href: `/view.html?c=${r.slug}`,
      // hero_image from public_verified_catalog already encodes the
      // "[good]" suffix correctly as %20%5Bgood%5D — use it verbatim.
      cover: r.hero_image,
    }));

  return json({ reply: enrichedReply, concepts, model: res.model, provider });
});
