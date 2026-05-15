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

/* Big knowledge bundles are NOT imported anymore — MCP deploy can't handle
   2MB of inlined JSON. They are hosted on jsdelivr (mirror of the GitHub
   repo) and fetched lazily on first request, then cached in module scope
   for the edge function's lifetime (~10 min between cold starts).
   Files at:
     https://cdn.jsdelivr.net/gh/tatyana-mama/micro.svita.ai@main/data/concept_texts.json
     https://cdn.jsdelivr.net/gh/tatyana-mama/micro.svita.ai@main/data/concept_rich.json
     https://cdn.jsdelivr.net/gh/tatyana-mama/micro.svita.ai@main/data/concept_embeddings.json
*/
const CDN_BASE = 'https://cdn.jsdelivr.net/gh/tatyana-mama/micro.svita.ai@main/data';

const LLM_PROVIDER = (Deno.env.get('LLM_PROVIDER') ?? 'ollama').toLowerCase();
const LLM_ENDPOINT = (Deno.env.get('LLM_ENDPOINT') ?? '').replace(/\/+$/, '');
const LLM_MODEL = Deno.env.get('LLM_MODEL') ?? 'qwen3:14b';
const EMBED_MODEL = Deno.env.get('EMBED_MODEL') ?? 'all-minilm:33m';
const EMBEDDINGS_ENABLED = (Deno.env.get('EMBEDDINGS_ENABLED') ?? 'auto').toLowerCase(); // 'on' | 'off' | 'auto'

interface ConceptText {
  slug: string;
  title?: string;
  eyebrow?: string;
  hero_tag?: string;
  pretext?: string;
  slides?: string[];
}

/* Rich knowledge bundle produced by Agent B1 — 91 concepts × ~4KB each, with
   the densest searchable string per concept (search_text). Keyword scoring
   queries THIS instead of the catalog row, so token-overlap matches anything
   that's mentioned anywhere in the brandbook (atmosphere, palette, materials,
   dice constraints, all 25 slide annotations). Recall is much higher than
   scoring against bare metadata. */
interface ConceptRich {
  slug: string;
  catalog_number?: number;
  name?: string;
  category?: string;
  country?: string;
  city?: string;
  size_m2?: number;
  budget_eur?: number;
  weeks?: number;
  tagline?: string;
  hero_image?: string;
  eyebrow?: string;
  pretext?: string;
  slides?: string[];
  palette_hex?: string[];
  dice?: Record<string, string>;
  keywords?: string[];
  atmosphere_words?: string[];
  search_text?: string;
}

/* Lazy CDN cache — fetched once per cold start, reused for all subsequent
   requests on the same worker instance. ~2MB total; jsdelivr serves in
   ~150ms warm-cached. */
let conceptTexts: Record<string, ConceptText> = {};
let conceptRich: Record<string, ConceptRich> = {};
let cdnLoadedAt = 0;
const CDN_TTL_MS = 10 * 60 * 1000; // 10 min — match GH Pages cache

async function loadCdnBundles(): Promise<void> {
  if (Date.now() - cdnLoadedAt < CDN_TTL_MS && Object.keys(conceptRich).length > 0) {
    return; // warm cache hit
  }
  try {
    const [textsRes, richRes] = await Promise.all([
      fetch(`${CDN_BASE}/concept_texts.json`, { signal: AbortSignal.timeout(15000) }),
      fetch(`${CDN_BASE}/concept_rich.json`,  { signal: AbortSignal.timeout(15000) }),
    ]);
    if (textsRes.ok) conceptTexts = await textsRes.json();
    if (richRes.ok)  conceptRich  = await richRes.json();
    cdnLoadedAt = Date.now();
    console.log('[advisor] CDN bundles loaded:', Object.keys(conceptTexts).length, 'texts /', Object.keys(conceptRich).length, 'rich');
  } catch (e) {
    console.log('[advisor] CDN bundle load failed:', (e as Error).message);
  }
}

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

/* ─── Embeddings layer ────────────────────────────────────────────────────
   Tries to import a precomputed vector index of all 91 concepts. When the
   bundle includes `concept_embeddings.json`, we embed the visitor's query at
   runtime via Ollama's /api/embed (all-minilm:33m, 384-dim, ~80ms on Jetson)
   and rank by cosine similarity — replacing keyword scoring with real
   semantic retrieval. Gracefully falls back to keyword scoring on any error
   so the concierge never breaks if Jetson is offline. */
type ConceptVectorIndex = {
  model: string; dim: number; normalized: boolean;
  built_at?: string; count: number;
  vectors: Record<string, number[]>;
};
let conceptVectors: ConceptVectorIndex | null = null;
let vectorsLoadedAt = 0;

async function loadVectors(): Promise<void> {
  if (Date.now() - vectorsLoadedAt < CDN_TTL_MS && conceptVectors) return;
  try {
    const r = await fetch(`${CDN_BASE}/concept_embeddings.json`, { signal: AbortSignal.timeout(15000) });
    if (r.ok) {
      conceptVectors = await r.json();
      vectorsLoadedAt = Date.now();
      console.log('[advisor] concept_embeddings.json loaded from CDN:', conceptVectors?.count, 'vectors');
    } else {
      console.log('[advisor] vectors fetch failed:', r.status);
    }
  } catch (e) {
    console.log('[advisor] vectors fetch error:', (e as Error).message);
  }
}

async function embedQuery(text: string): Promise<number[] | null> {
  if (!LLM_ENDPOINT) return null;
  try {
    const r = await fetch(`${LLM_ENDPOINT}/api/embed`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ model: EMBED_MODEL, input: text.slice(0, 2000) }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return null;
    const data = await r.json();
    const vec = data?.embeddings?.[0];
    return Array.isArray(vec) && vec.length > 0 ? vec : null;
  } catch { return null; }
}

function cosine(a: number[], b: number[]): number {
  /* If precomputed vectors are L2-normalized AND query vec is normalized too,
     this is just dot. Ollama's all-minilm output is not L2-normed by default
     so we compute proper cosine. */
  const len = Math.min(a.length, b.length);
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na  += a[i] * a[i];
    nb  += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

async function semanticScore(query: string, rows: CatalogRow[], k = 12): Promise<CatalogRow[] | null> {
  if (EMBEDDINGS_ENABLED === 'off') return null;
  if (!conceptVectors) await loadVectors();
  if (!conceptVectors || !conceptVectors.vectors) return null;
  const qvec = await embedQuery(query);
  if (!qvec) return null;

  /* HYBRID scoring (v6) — fixes B5 watch-repair regression where pure
     semantic ranked zurich-fondue-cellar above basel-watch-repair for
     "watch repair in Switzerland". Combines three axes:
        final = 0.65 * semantic_cosine
              + 0.25 * keyword_token_overlap (rich.search_text)
              + 0.10 * category_match_bonus  (query mentions cat keyword)
     The keyword & category boost rescue exact-match cases that pure
     semantic drowns in country/style proximity. */
  const tokens = tokenize(query);
  const lowerQ = query.toLowerCase();
  const CAT_KEYWORDS: Record<string, string[]> = {
    repair:    ['repair','fix','watch','watches','phone','clock','clocks','tv','часы','часов','зегарм','наручные','remont','ремонт','ремонту','watch-repair','наручні'],
    food:      ['cafe','coffee','bagel','bakery','pizza','pastry','еда','кафе','кофе','кофейн','пекарн','хлеб','выпечка','restaurant','food','meal','cuisine','завтрак','breakfast'],
    craft:     ['craft','atelier','workshop','ceramics','ceramic','candle','candles','wood','glass','pottery','leather','керамик','ремесла','ремесло','свеч','стекл','rzemio','ремесел','шкіра','шкіря'],
    beauty:    ['beauty','salon','spa','hair','nail','nails','барбер','barber','barbershop','салон','краса','краси','маникюр'],
    health:    ['health','clinic','dental','dentist','massage','therapy','здоров','здоровье','клиник','стомат','dent','медицин'],
    service:   ['service','services','wash','clean','laundry','bike','услуг','послуг','паслуг','сервис','стирк','laundr'],
    retail:    ['shop','store','retail','boutique','магазин','sklep','крам'],
    education: ['school','class','course','lesson','teach','школа','курс','учеб','навчанн'],
    wellness:  ['yoga','pilates','meditation','sauna','йог','пилатес','медитац','спа','sauna','медытац'],
    restaurant:['restaurant','dining','bistro','tavern','ресторан','restauracja'],
  };

  const scored: { row: CatalogRow; sim: number; final: number }[] = [];
  for (const r of rows) {
    const v = conceptVectors.vectors[r.slug];
    if (!v) continue;
    const sim = cosine(qvec, v);
    const rich = conceptRich[r.slug];
    const hay = ((rich?.search_text || '') + ' ' + (r.tagline || '') + ' ' + (r.name || '') + ' ' + (r.category || '')).toLowerCase();
    let kwHits = 0;
    for (const t of tokens) if (hay.includes(t)) kwHits++;
    const kwScore = tokens.length ? Math.min(1, kwHits / Math.max(2, tokens.length)) : 0;
    let catBonus = 0;
    if (r.category && CAT_KEYWORDS[r.category]) {
      for (const kw of CAT_KEYWORDS[r.category]) {
        if (lowerQ.includes(kw)) { catBonus = 1; break; }
      }
    }
    const final = 0.65 * sim + 0.25 * kwScore + 0.10 * catBonus;
    scored.push({ row: r, sim, final });
  }
  scored.sort((a, b) => b.final - a.final);
  /* Floor on hybrid final score. Yoga/wine/watch land 0.25-0.45 with hybrid;
     0.15 keeps weak-but-real picks, drops pure noise. */
  const positives = scored.filter(s => s.final > 0.15);
  if (!positives.length) return null;
  console.log('[advisor] hybrid top-3:', positives.slice(0, 3).map(s => `${s.row.slug}(s=${s.sim.toFixed(2)},f=${s.final.toFixed(2)})`).join(' | '));
  return positives.slice(0, k).map(s => s.row);
}

/* For a given user query, score every catalog row by how many tokens match in
   the rich knowledge bundle (slug/name/category/country/tagline + ALL 25 slide
   annotations + dice constraints + atmosphere words). Returns the top-K rows
   ordered by score. Scoring axes are weighted: direct meta (cat/country/slug)
   match counts more than body-text match because metadata is intentional. */
function scoreConcepts(query: string, rows: CatalogRow[], k = 12): CatalogRow[] {
  const tokens = tokenize(query);
  if (!tokens.length) return rows.slice(0, k);

  const scored = rows.map(r => {
    const rich = conceptRich[r.slug];
    /* Strongest signals: explicit metadata + tagline + city. */
    const metaHay = [
      r.slug || '', r.name || '', r.category || '', r.country || '',
      r.tagline || '', rich?.city || '', ...(rich?.keywords || []),
    ].join(' ').toLowerCase();
    /* Supporting signals: full rich search_text (all slides, palette, dice,
       atmosphere words — ~4KB per concept). */
    const richHay = (rich?.search_text || '').toLowerCase();
    /* Fallback: legacy concept_texts dict (kept for safety if rich missing). */
    const deep = conceptTexts[r.slug];
    const deepHay = deep && !rich
      ? [deep.title, deep.eyebrow, deep.hero_tag, deep.pretext,
         ...(deep.slides ? deep.slides.slice(0, 6) : [])].filter(Boolean).join(' ').toLowerCase()
      : '';
    let score = 0;
    for (const t of tokens) {
      if (metaHay.includes(t)) score += 4;      // direct meta match — strongest
      if (richHay.includes(t)) score += 1;      // rich body/slide/dice match
      if (deepHay.includes(t)) score += 1;      // legacy fallback
    }
    return { r, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const positives = scored.filter(s => s.score > 0);
  if (!positives.length) return [];
  return positives.slice(0, k).map(s => s.r);
}

/* For a concept's slide list, pull the 3 most semantically informative slide
   annotations: slide-02 "what it is", slide-08/09 "ritual/atmosphere", slide-19
   "moment". These three answer 80% of "is this what I want?" questions without
   blowing the prompt. Falls back gracefully if fewer slides are available. */
function compactSlideHighlights(slides: string[]): string {
  if (!slides || !slides.length) return '';
  const pick = (idx: number) => (idx < slides.length ? slides[idx] : '');
  const lines = [pick(1), pick(7), pick(8), pick(18)].filter(s => s && s.length > 10);
  return lines.map(l => `      • ${l.slice(0, 280)}`).join('\n');
}

async function buildBestMatchesBlock(query: string, rows: CatalogRow[], shown: string[]): Promise<string> {
  /* Two-stage retrieval:
       1. Semantic (Jetson Ollama all-minilm:33m + cosine) if vectors+endpoint
          available. Catches "что-то тёплое и тактильное" → ceramics/wood/leather
          even without literal word matches.
       2. Keyword overlap fallback (tokenise vs rich.search_text) if semantic
          unavailable or returns nothing strong. */
  let ranked: CatalogRow[] | null = await semanticScore(query, rows, 24);
  let mode = 'semantic';
  if (!ranked || !ranked.length) {
    ranked = scoreConcepts(query, rows, 24);
    mode = 'keyword';
  }
  ranked = ranked.filter(r => !shown.includes(r.slug.toLowerCase()));
  if (!ranked.length) return '';
  const top = ranked.slice(0, 12);
  console.log('[advisor] best-matches via', mode, '→', top.map(r => r.slug).join(','));
  /* Each top concept gets a RICH block: metadata + atmosphere + dice
     constraints + 4 most informative slide annotations + palette hex.
     Model writes faithful sensory "why this fits" sentences from this. */
  const blocks = top.map(r => {
    const rich = conceptRich[r.slug];
    const deep = conceptTexts[r.slug];
    const budget = r.budget_eur ? `~€${r.budget_eur.toLocaleString('en-US')}` : '—';
    const city = rich?.city ? ` · ${rich.city}` : '';
    const weeks = rich?.weeks ? ` · ${rich.weeks}w to open` : '';
    const meta = `▶ ${r.slug} · ${r.name ?? r.slug} · ${r.category ?? '—'} · ${r.country ?? '—'}${city} · ${r.size_m2 ?? '—'}m² · open ${budget}${weeks}`;
    const tagline = r.tagline ? `   tagline: ${r.tagline}` : '';
    const eyebrow = rich?.eyebrow && rich.eyebrow !== r.name ? `   eyebrow: ${rich.eyebrow.slice(0, 200)}` : '';
    const atmosphere = (rich?.pretext || deep?.pretext)
      ? `   atmosphere: ${(rich?.pretext || deep?.pretext || '').slice(0, 280)}`
      : '';
    const palette = (rich?.palette_hex && rich.palette_hex.length)
      ? `   palette: ${rich.palette_hex.slice(0, 5).join(', ')}`
      : '';
    const dice = (rich?.dice && Object.keys(rich.dice).length)
      ? `   style: ${Object.entries(rich.dice).slice(0, 5).map(([k, v]) => `${k}=${v}`).join(' · ')}`
      : '';
    const atmosphereWords = (rich?.atmosphere_words && rich.atmosphere_words.length)
      ? `   feels: ${rich.atmosphere_words.slice(0, 6).join(', ')}`
      : '';
    const slides = (rich?.slides || deep?.slides) ? compactSlideHighlights(rich?.slides || deep?.slides || []) : '';
    return [meta, tagline, eyebrow, atmosphere, palette, dice, atmosphereWords, slides]
      .filter(Boolean).join('\n');
  }).join('\n\n');

  return [
    '',
    '═════════════ BEST MATCHES FOR THIS TURN — RICH KNOWLEDGE ═════════════',
    `Top-${top.length} concepts from the catalog scored against the visitor's last message (keyword overlap on metadata + slide bodies). Already filters out slugs you\'ve recommended earlier in this chat — these are FRESH options.`,
    '',
    'Each block carries (lines present depend on what was extracted per concept):',
    '             ▶ slug · name · category · country · city · size · open-budget · weeks-to-open',
    '             tagline (one-line positioning)',
    '             eyebrow (slide-01 headline)',
    '             atmosphere (the concept manifesto / pretext)',
    '             palette (HEX codes used in the brandbook)',
    '             style (dice constraints: region/archetype/mood/light/texture/season/time)',
    '             feels (atmosphere keywords — emotional cues for tone-matching)',
    '             • slide-02 (what it physically is)',
    '             • slide-08 (the ritual / moment of use)',
    '             • slide-09 (the still-life of materials)',
    '             • slide-19 (the signature moment that sells the place)',
    '',
    'Use this depth to write specific, sensory "why this fits" sentences (the smell, the texture, the time of day, the palette resonance) — NOT generic tagline paraphrases. When palette/style/feels align with the visitor\'s vibe words, name the alignment explicitly.',
    '',
    blocks,
    '',
    '═══════════════════════════════════════════════════════════════════════',
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

  return `You are micro.svita's catalog concierge — a calm, sharp, editorial advisor who helps the visitor pick their perfect concept in 3 turns or fewer.

🛑 ABSOLUTE GROUND TRUTH RULE (HIGHEST PRIORITY — VIOLATING THIS BREAKS THE PRODUCT)
You may ONLY recommend concepts that appear in the BEST MATCHES list or the CATALOG SNAPSHOT below. NEVER invent a concept name. NEVER guess a slug. NEVER fill a list to a target count with made-up businesses. If you find yourself writing "Кофе-день" or "Магазин редких книг" or any plausible-sounding business that you did NOT see in the lists below — STOP. That is a hallucination. The visitor will click and find nothing, trust collapses.

If the retrieved BEST MATCHES list is empty OR none of the matches actually fit the visitor's stated craft/city/budget — say so HONESTLY in their language, like this example (the BE turn that worked):
"На жаль, у нашым каталозе цяпер няма канцэпцыі ў <city/craft>. Найбліжэйшае, што ёсць — <закінь 1 адзін альтэрнатыўны слаг>. Хочаш паглядзець яго?"

Honest "no" + one nearest alternative is ALWAYS better than confident fabrication. Prompt 1 of the stress test failed because the model invented "Кофе-день", "Кофе-дом", "Кофе-кафе" instead of admitting "у нас нет кофейни в Берлине". Don't repeat that failure.



VOICE & TONE (non-negotiable)
- Smart, warm, low-key. Editorial — like a magazine editor, not a salesman.
- Polite by default ("спасибо", "thank you", "please" naturally inserted). Never pushy, never apologetic-corporate ("we appreciate your business"). Never use emoji.
- Precision over pleasantries. Each sentence advances the visitor toward a decision.
- One witty observation per turn is welcome ("intriguing combo — Bordeaux wine plus a yoga loft, almost no one tries this") — never more than one, never forced.
- Match the visitor's energy: if they're terse, you're terse. If they're curious and chatty, give them a bit more colour. Always shorter than expected.

YOUR REASONING PROCESS (run silently before composing every reply)
1. PARSE the visitor's last message + the running profile (memory below): extract craft, budget, city, scale, vibe, language.
2. INSPECT the BEST MATCHES shortlist (keyword-ranked, already excludes slugs you've recommended in this chat). For each candidate, score (1-5) on three axes: craft-fit, budget-fit, vibe-fit. Sum, sort.
3. DECIDE: if the top candidate's combined score ≥ 10/15, recommend it confidently. If 7-9, recommend BUT acknowledge the gap ("close to what you described, the small adjustment is X"). If <7, do NOT guess — ask ONE narrowing question and STOP for this turn.
4. WRITE: 3-5 short sentences. Lead with the recommendation (or the question). End with the slug-link line. Skip the reasoning steps in the visible output — keep them in your head.

ABOUT MICRO.SVITA
micro.svita.ai is a SUBSCRIPTION library of ready-to-launch micro-businesses across Europe — boutique cafés, bars, ateliers, repair studios, juice labs, watch shops, etc. Each concept ships as a 25-slide editorial PDF (palette, interior axonometry, signage, menu, CAPEX in EUR, 4-week opening plan).


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

REFINEMENT TURNS — when visitor says "more / another / ещё / inny / другие"
The retrieval system has ALREADY excluded slugs you've recommended earlier in this conversation. So the BEST MATCHES list is FRESH. Pick from it. Do NOT re-recommend old slugs. Do NOT invent new businesses. If BEST MATCHES is now thin (4 or fewer), say so honestly: "вот ещё две, что подходят под твои критерии — других в каталоге нет под такой запрос". Honest scarcity beats fake abundance.

RULES
- Recommend ONLY concepts from the catalog snapshot below. Never invent a concept, a slug, a category or a budget that isn't listed.
- When you suggest a concept, ALWAYS include its slug on its own line in this exact format: \`→ /shop.html?concept=<slug>\`. The slug-line is what renders as a visual preview card for the visitor — without it they see only text. EVERY recommendation needs ≥1 slug-line. If you mention 2 concepts in passing ("between X and Y, X is better because…"), emit BOTH slug-lines so the visitor sees both cards side by side.
- Default to TWO concepts per recommendation turn: one primary best-fit + one editorial alternative (different category or different country, to widen the lens). Three is fine if all three serve distinct reasons. Single-concept reply only when the visitor explicitly asked for ONE thing or you have very high confidence on one option.
- The open-business budget is what they'd spend to actually launch — that's the big number, NOT the subscription price. Quote only the open-budget column.
- Stay short: 3–5 short sentences. The visitor is on a phone while browsing — every word earns its place.
- ALWAYS finish your last sentence and close every bullet. If you sense you are running out of room, end EARLIER with a complete thought — never let the reply trail off mid-word or mid-bullet.
- If the visitor is unsure (no signal on craft/budget/city/scale/vibe), ask ONE clarifying question and STOP. Do not also try to recommend in the same turn. The question should be the dimension that narrows fastest — usually craft ("what's the activity — coffee, repair, beauty, craft, food?") or budget ("rough budget to open — under €15k, €15-30k, or €30k+?").
- If nothing in the catalog truly fits (after honest score-check), say so plainly and propose the closest TWO with one sentence each on what's similar / what's different.
- If the visitor asks "how much does this cost?", answer with the subscription ($19/mo or $149/yr, 2-day trial). DO NOT quote per-concept prices.
- Speak the user's language (English, Polish, Ukrainian, Belarusian, Russian — whichever they used).
- BELARUSIAN GLOSSARY (use these forms, NOT Ukrainian look-alikes):
    use «няма», NOT «немає»
    use «цяпер», NOT «наразі»
    use «гэта», NOT «це»
    use «у нашым каталозе», NOT «у нашому каталозі»
    use «знойдзена/знайдзена», NOT «знайдено»
    use «Згодна з данымі», NOT «Згідна з данимі»
    use «кожны», NOT «кожен»
- DO NOT echo internal slide-card headings to the user. Phrases like "Read the place like a magazine", "Twenty-five frames", "Scroll, don't skim", "Each frame is a decision" are INTERNAL editorial template language — never reproduce them in your reply. They belong on the brandbook PDF, not in chat.
- NEVER format a "▶ slug · NN · BRAND · cat · country · m² · open €…" line for a slug that does not appear in the BEST MATCHES list or the catalog snapshot. That formatting is reserved for REAL catalog rows. A line written in this shape with a fake slug is a critical error. Match register: formal Russian if they wrote formal Russian, casual Polish if they wrote casual Polish, etc.

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
      /* 0.7 sweet-spot: enough variety to avoid slug-cycling, low enough to
         keep grounding (B3 stress-test showed 0.75 was already on the edge of
         degeneration loops). 400 tokens caps the verbose-padding pattern —
         comparison intent gets bumped to 600 below if detected. */
      options: { temperature: 0.7, num_predict: 400 },
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

/* Parse hard constraints (budget cap, city, country) from the visitor's
   message so the retriever can pre-filter candidates instead of relying on
   the LLM to "remember" them. B3 stress-test showed budget was echoed but
   not enforced — pre-filtering fixes that at the retrieval layer. */
interface QueryConstraints {
  maxBudget?: number;     // EUR — visitor's stated ceiling
  city?: string;          // lowercase city name (catalog match)
  country?: string;       // ISO-2 from catalog
}

function extractConstraints(message: string, rows: CatalogRow[]): QueryConstraints {
  const c: QueryConstraints = {};
  const m = message.toLowerCase();

  /* Budget — "до X (тыс|тысяч|k|тис|€|евро) ; under X ; до Xk" — picks the
     ceiling number. Accepts 20k, 20 000, 20.000, 15 тысяч, до €15 000. */
  const budgetPatterns = [
    /(?:до|под|under|менее|less\s+than|до)\s*€?\s*(\d{1,3}(?:[ .,]?\d{3})*|\d+)\s*(?:k|к|тыс|тысяч|тис|тысячi|тысячи|тысячах)?/i,
    /€\s*(\d{1,3}(?:[ .,]?\d{3})*|\d+)\s*(?:k|к|тыс|тысяч)?/i,
    /(\d{1,3}(?:[ .,]?\d{3})*|\d+)\s*(?:k|к)\s*€?/i,
  ];
  for (const p of budgetPatterns) {
    const hit = m.match(p);
    if (hit) {
      const numRaw = hit[1].replace(/[ .,]/g, '');
      let num = parseInt(numRaw, 10);
      if (!isNaN(num)) {
        if (/\d\s*[kк]/i.test(hit[0]) || /тыс|тис/.test(hit[0])) num *= 1000;
        if (num > 1000 && num < 1_000_000) {
          c.maxBudget = num;
          break;
        }
      }
    }
  }

  /* City — scan known cities from catalog (rich.city is populated). Match
     case-insensitively + handles RU/UK declensions ("в Берлине", "у Львові",
     "в Варшаве") by checking if the city stem appears anywhere. */
  const cities = new Set<string>();
  for (const r of rows) {
    const rich = conceptRich[r.slug];
    if (rich?.city) cities.add(rich.city.toLowerCase());
  }
  /* Manual stem map — declension-tolerant matching for the major Slavic langs.
     Stem must appear as a substring in the lowercase message. */
  const cityStems: Array<[string, string]> = [
    ['berlin', 'berlin'], ['берлин', 'berlin'], ['берлине', 'berlin'],
    ['paris', 'paris'], ['париж', 'paris'],
    ['lisbon', 'lisbon'], ['lisboa', 'lisbon'], ['лиссабон', 'lisbon'], ['лісабон', 'lisbon'],
    ['amsterdam', 'amsterdam'], ['амстердам', 'amsterdam'],
    ['warsaw', 'warsaw'], ['warszaw', 'warsaw'], ['варшав', 'warsaw'], ['варшаве', 'warsaw'],
    ['stockholm', 'stockholm'], ['стокгольм', 'stockholm'],
    ['helsinki', 'helsinki'], ['хельсинки', 'helsinki'],
    ['vienna', 'vienna'], ['wien', 'vienna'], ['вена', 'vienna'], ['вене', 'vienna'],
    ['milano', 'milano'], ['milan', 'milano'], ['милан', 'milano'],
    ['ljubljana', 'ljubljana'], ['любляна', 'ljubljana'],
    ['cluj', 'cluj'],
    ['brussels', 'brussels'], ['bruxelles', 'brussels'], ['брюссел', 'brussels'],
    ['copenhagen', 'copenhagen'], ['københavn', 'copenhagen'], ['копенгаген', 'copenhagen'],
    ['budapest', 'budapest'], ['будапешт', 'budapest'],
    ['poznan', 'poznan'], ['poznań', 'poznan'], ['познан', 'poznan'],
    ['krakow', 'krakow'], ['kraków', 'krakow'], ['краков', 'krakow'],
    ['wroclaw', 'wroclaw'], ['wrocław', 'wroclaw'], ['вроцлав', 'wroclaw'],
    ['bordeaux', 'bordeaux'], ['бордо', 'bordeaux'],
    ['basel', 'basel'], ['базель', 'basel'],
    ['zurich', 'zurich'], ['zürich', 'zurich'], ['цюрих', 'zurich'],
    ['prague', 'prague'], ['praha', 'prague'], ['прага', 'prague'], ['праге', 'prague'],
    ['bratislava', 'bratislava'], ['братислав', 'bratislava'],
    ['bucharest', 'bucharest'], ['бухарест', 'bucharest'],
    ['tallinn', 'tallinn'], ['таллин', 'tallinn'],
    ['cairo', 'cairo'], ['каир', 'cairo'],
    ['tel aviv', 'tel-aviv'], ['тель-авив', 'tel-aviv'], ['тель авив', 'tel-aviv'],
    ['delft', 'delft'], ['дельфт', 'delft'],
    ['marseille', 'marseille'], ['марсель', 'marseille'],
    ['madrid', 'madrid'], ['мадрид', 'madrid'],
    ['florence', 'florence'], ['firenze', 'florence'], ['флоренц', 'florence'],
  ];
  for (const [stem, canon] of cityStems) {
    if (m.includes(stem) && cities.has(canon)) {
      c.city = canon;
      break;
    }
  }
  return c;
}

function applyConstraints(rows: CatalogRow[], cons: QueryConstraints): CatalogRow[] {
  let filtered = rows;
  if (cons.maxBudget != null) {
    filtered = filtered.filter(r => !r.budget_eur || r.budget_eur <= cons.maxBudget!);
  }
  if (cons.city) {
    filtered = filtered.filter(r => {
      const rich = conceptRich[r.slug];
      return rich?.city?.toLowerCase() === cons.city;
    });
  }
  return filtered;
}

/* Detect refinement intent — visitor wants MORE of the same kind, not a new
   topic. Used to (a) feed the retriever the prior query + exclusion list, (b)
   tell the LLM "this is a follow-up, don't re-recommend slugs already shown". */
function isRefinementIntent(msg: string): boolean {
  const m = msg.toLowerCase().trim();
  if (m.length > 60) return false; // refinements are short
  return /^(ещё|еще|ещё варианты|еще варианты|еще|больше|другие|other|another|more|more options|показать ещё|inne|inny|jeszcze|ще|ще варіанти|іншое|іншыя)\s*\??$/.test(m)
      || /^(давай ещё|give me more|next|cheaper|дешевле|таньше|tańsze|меньше|smaller|быстрее|faster)/.test(m);
}

/* Detect non-pricing FAQ intents that can be served deterministically (no
   LLM hop) — saves 30+s and removes hallucination risk. */
function detectFaqIntent(msg: string): 'subscribe'|'cancel'|'refund'|'trial'|'what_is'|null {
  const m = msg.toLowerCase();
  if (/(как (мне )?подписат|how (do i|to) subscribe|how (do i|to) sign up|jak (się )?zapis|як підписатися|як падпісацца)/.test(m)) return 'subscribe';
  if (/(как (мне )?отменит|how (do i|to) cancel|cancel my|jak anulować|як скасувати|як адмяніць)/.test(m)) return 'cancel';
  if (/(возврат|refund|zwrot|повернення коштів|вяртанне грошай|money back)/.test(m)) return 'refund';
  if (/(пробный|trial|free trial|демо|demo|пробка|пробу|próbn|пробу|пробны)/.test(m)) return 'trial';
  if (/^(what is micro.?svita|что такое micro.?svita|што такое micro.?svita|czym jest micro.?svita|що таке micro.?svita|про сайт|про вас)/.test(m)) return 'what_is';
  return null;
}

const FAQ_REPLIES: Record<string, Record<string, string>> = {
  subscribe: {
    en: 'Click **Subscribe** in the top nav, pick Monthly ($19) or Yearly ($149). Lemon Squeezy checkout asks for a card — once it\'s on file your 2-day free trial starts and the whole library unlocks instantly.',
    ru: 'Нажми **Подписка** в верхнем меню, выбери Помесячно ($19) или Год ($149). Lemon Squeezy попросит карту — как только она привязана, начинаются 2 бесплатных дня, и вся библиотека сразу открывается.',
    pl: 'Kliknij **Subskrypcja** w górnym menu, wybierz Miesięcznie ($19) lub Rocznie ($149). Lemon Squeezy poprosi o kartę — po jej dodaniu rusza 2-dniowy darmowy okres, cała biblioteka otwiera się od razu.',
    uk: 'Натисни **Підписка** у верхньому меню, обери Помісячно ($19) чи Рік ($149). Lemon Squeezy запитає картку — щойно вона прив\'язана, починаються 2 безкоштовних дні, і вся бібліотека відкривається миттєво.',
    be: 'Націсні **Падпіска** уверсе, абяры Штомесяц ($19) ці Год ($149). Lemon Squeezy папросіць карту — як толькі яна прывязана, ідуць 2 бясплатныя дні, і ўся бібліятэка адкрываецца адразу.'
  },
  cancel: {
    en: 'Sign in → **Account** → Manage subscription → Cancel. Takes one click via Lemon Squeezy. Cancellation stops the next renewal — current cycle stays active till the end.',
    ru: 'Войди → **Аккаунт** → Управление подпиской → Отменить. Один клик через Lemon Squeezy. Отмена останавливает следующее списание — текущий цикл доходит до конца.',
    pl: 'Zaloguj się → **Konto** → Zarządzaj subskrypcją → Anuluj. Jedno kliknięcie przez Lemon Squeezy. Anulowanie wstrzymuje kolejne odnowienie — bieżący okres trwa do końca.',
    uk: 'Увійди → **Акаунт** → Керування підпискою → Скасувати. Один клік через Lemon Squeezy. Скасування зупиняє наступне поновлення — поточний цикл працює до кінця.',
    be: 'Увайдзі → **Акаўнт** → Кіраванне падпіскай → Адмяніць. Адзін клік праз Lemon Squeezy. Адмена спыняе наступнае спісанне — бягучы цыкл працуе да канца.'
  },
  refund: {
    en: 'If the 2-day trial doesn\'t fit, just cancel — no charge applies. After the first month, write to support@micro.svita.ai with your order ID and we\'ll discuss case-by-case. Yearly subs are non-refundable past the trial.',
    ru: 'Если 2-дневный пробный не подошёл — просто отмени, никаких списаний. После первого месяца напиши на support@micro.svita.ai с order ID, разберём индивидуально. Годовая подписка не возвращается после пробного периода.',
    pl: 'Jeśli 2-dniowy okres próbny nie pasuje — anuluj, żadnej opłaty. Po pierwszym miesiącu napisz na support@micro.svita.ai z numerem zamówienia, rozpatrzymy indywidualnie. Subskrypcja roczna jest bezzwrotna po okresie próbnym.',
    uk: 'Якщо 2-денна пробна не підійшла — просто скасуй, ніяких списань. Після першого місяця напиши на support@micro.svita.ai із order ID, розглянемо індивідуально. Річна підписка не повертається після пробного періоду.',
    be: 'Калі 2-дзённая пробная не падышла — проста адмяні, ніякіх спісанняў. Пасля першага месяца напішы на support@micro.svita.ai з order ID, разгледзім індывідуальна. Гадавая падпіска не вяртаецца пасля пробнага перыяду.'
  },
  trial: {
    en: '2 days, free. Card required (Lemon Squeezy) — that\'s how we know you\'re serious. Cancel anytime in those 2 days, you\'re not charged. After 2 days the subscription auto-starts ($19/mo or $149/yr).',
    ru: '2 дня бесплатно. Карта нужна (Lemon Squeezy) — так мы знаем, что ты серьёзно. В эти 2 дня можно отменить, ничего не спишут. После — автостарт подписки ($19/мес или $149/год).',
    pl: '2 dni gratis. Karta wymagana (Lemon Squeezy) — żebyśmy wiedzieli, że na poważnie. W ciągu 2 dni anulujesz bez opłat. Potem auto-start subskrypcji ($19/mies lub $149/rok).',
    uk: '2 дні безкоштовно. Картка потрібна (Lemon Squeezy) — щоб ми знали, що серйозно. У ці 2 дні можна скасувати без оплати. Потім автостарт підписки ($19/міс чи $149/рік).',
    be: '2 дні бясплатна. Карта патрэбна (Lemon Squeezy) — каб мы ведалі, што сур\'ёзна. У гэтыя 2 дні можна адмяніць без аплаты. Пасля — аўтастарт падпіскі ($19/мес ці $149/год).'
  },
  what_is: {
    en: 'micro.svita.ai is a subscription library of 91+ ready-to-launch micro-business concepts across Europe. Each concept = a 25-slide editorial brandbook (palette, axonometry, menu, CAPEX in EUR, week-by-week opening plan). Take the dossier, hand it to your contractor — no agency, no architects, no waiting six months. $19/mo unlocks everything.',
    ru: 'micro.svita.ai — это подписочная библиотека из 91+ готовых к запуску концепций микробизнеса по всей Европе. Каждая концепция = 25-страничный editorial-брендбук (палитра, аксонометрия, меню, CAPEX в евро, понедельный план открытия). Забираешь дoсье, отдаёшь подрядчику — без агентств, без архитекторов, без полугода ожидания. $19/мес открывает всё.',
    pl: 'micro.svita.ai to subskrypcyjna biblioteka 91+ gotowych do uruchomienia konceptów mikrobiznesu w Europie. Każdy koncept = 25-stronicowy editorial-brandbook (paleta, aksonometria, menu, CAPEX w euro, tygodniowy plan otwarcia). Bierzesz dossier, dajesz wykonawcy — bez agencji, bez architektów, bez pół roku oczekiwania. $19/mies otwiera wszystko.',
    uk: 'micro.svita.ai — це підписна бібліотека з 91+ готових до запуску концепцій мікробізнесу по Європі. Кожна концепція = 25-сторінковий editorial-брендбук (палітра, аксонометрія, меню, CAPEX в євро, потижневий план відкриття). Береш досьє, віддаєш підряднику — без агенцій, без архітекторів, без півроку очікування. $19/міс відкриває все.',
    be: 'micro.svita.ai — гэта падпісная бібліятэка з 91+ гатовых да запуску канцэпцый мікрабізнэсу па Еўропе. Кожная канцэпцыя = 25-старонкавы editorial-брэндбук (палітра, аксанаметрыя, меню, CAPEX у еўра, патыдневы план адкрыцця). Бярэш дасье, аддаеш падрадчыку — без агенцый, без архітэктараў, без паўгода чакання. $19/мес адкрывае ўсё.'
  }
};
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
  // Deterministic short-circuit for FAQ intents (subscribe/cancel/refund/trial/what-is)
  const faqIntent = detectFaqIntent(message);
  if (faqIntent) {
    const lang = detectLanguage(message);
    const reply = FAQ_REPLIES[faqIntent][lang] || FAQ_REPLIES[faqIntent].en;
    return json({ reply, model: `static-faq:${faqIntent}`, provider: 'override' });
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
    /* Lazy-load CDN bundles (concept_texts + concept_rich) — first request
       per cold start pays ~300ms, subsequent requests reuse the in-memory
       cache for 10 min. Empty objects on failure → graceful degradation
       (model still has the catalog snapshot from buildSystemPrompt). */
    await loadCdnBundles();
    /* Apply hard constraints (budget cap, city) by pre-filtering candidate
       rows BEFORE retrieval. If filter empties the pool, the BEST MATCHES
       block disappears and the model is forced into honest-refusal mode by
       the ABSOLUTE GROUND TRUTH rule. */
    const constraints = extractConstraints(message, catalogRows);
    const filteredRows = applyConstraints(catalogRows, constraints);
    console.log('[advisor] constraints:', JSON.stringify(constraints), '→', filteredRows.length, '/', catalogRows.length);
    system = buildSystemPrompt(catalogRows);
    /* If constraints were extracted, surface them to the model so the
       refuse-honestly template can fire when filteredRows is empty. */
    if (constraints.maxBudget != null || constraints.city) {
      const parts: string[] = [];
      if (constraints.maxBudget != null) parts.push(`max budget €${constraints.maxBudget.toLocaleString('en-US')}`);
      if (constraints.city) parts.push(`city = ${constraints.city}`);
      system += `\n\nDETECTED HARD CONSTRAINTS THIS TURN: ${parts.join(', ')}\nThe retriever PRE-FILTERED the catalog to ${filteredRows.length} concept(s) matching these constraints. If that number is 0 (zero), there is NOTHING in the catalog matching the visitor's hard constraints — refuse honestly in their language and offer the closest 1–2 from the full catalog as a relaxation option.\n`;
    }
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
    /* BEST MATCHES uses the CONSTRAINT-FILTERED pool — keeps recommendations
       inside the visitor's stated budget/city. If filteredRows is empty,
       block returns '' and the model goes into honest-refusal mode. */
    const bestMatches = await buildBestMatchesBlock(message, filteredRows, shownSlugs);
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
  let enrichedReply = enrichWithSlugLinks(res.reply, catalogRows);

  /* SLUG VALIDATOR — strip any `/shop.html?concept=X` whose X is not a real
     slug in the catalog. Prevents broken-link clicks from hallucinated slugs. */
  const validSlugs = new Set(catalogRows.map(r => r.slug.toLowerCase()));
  enrichedReply = enrichedReply.replace(/\/shop\.html\?concept=([a-z0-9\-]+)/gi, (m, slug) => {
    return validSlugs.has(String(slug).toLowerCase()) ? m : '';
  });

  /* ANCHOR VALIDATOR (v6) — B5 showed model emits "▶ ljubljana-bakery · 06
     · BAKERY · food · SI · 24m² · open ~€14,600" formatted exactly like a
     catalog row, but ljubljana-bakery isn't in the catalog. Drop any "▶ X"
     line whose X (first token after ▶) is not a real slug. Also strips a
     few common SOP-boilerplate phrases that bleed into prose. */
  const ANCHOR_RE = /^[ \t]*[▶►][ \t]+([a-z0-9\-]+)[ \t]*[·.,—-][^\n]*$/gim;
  enrichedReply = enrichedReply.replace(ANCHOR_RE, (line, slug) => {
    return validSlugs.has(String(slug).toLowerCase()) ? line : '';
  });
  /* SOP BOILERPLATE STRIP — these phrases come from concept_texts.json slide
     pretexts (the "Read the place like a magazine. Twenty-five frames…"
     line) and shouldn't reach the user. Eat the sentence. */
  const SOP_STRIPS = [
    /Read the place like a magazine\.[^.]*?\./gi,
    /Twenty[- ]five frames[^.]*?\./gi,
    /Scroll, don.{1,3}t skim\.[^.]*?\./gi,
    /Each frame is a decision waiting[^.]*?\./gi,
  ];
  for (const re of SOP_STRIPS) enrichedReply = enrichedReply.replace(re, '');

  /* Tidy whitespace after possible strips. */
  enrichedReply = enrichedReply.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

  /* PREVIEW-CARDS ENFORCEMENT — visitor expects to SEE concepts as cards, not
     just read about them. If the reply mentions a recommendation but doesn't
     emit any slug-link, the UI shows zero cards (broken UX). Postprocess:
     - if the reply seems to recommend (has slugs already via enrichment) — OK
     - if zero slugs AND the user message wasn't a clarifying question intent
       AND the BEST MATCHES shortlist has candidates — inject the top-2 as
       slug-lines at the bottom so the visitor at least sees previews to
       click. The model's text stays intact; we only add the navigable cards. */
  const slugsInReply = (enrichedReply.match(/\/shop\.html\?concept=([a-z0-9\-]+)/gi) || []).length;
  const isClarifyingQuestion = /\?$/.test(enrichedReply.trim().slice(-200)) && enrichedReply.length < 500;
  if (slugsInReply === 0 && !isClarifyingQuestion) {
    const shownSlugs2 = extractShownSlugs(turns);
    const fallbackTop = scoreConcepts(message, catalogRows, 6)
      .filter(r => !shownSlugs2.includes(r.slug.toLowerCase()))
      .slice(0, 2);
    if (fallbackTop.length) {
      enrichedReply = enrichedReply.trimEnd() + '\n\n' +
        fallbackTop.map(r => `→ /shop.html?concept=${r.slug}`).join('\n');
    }
  }

  // Attach a small metadata bundle for each slug we just mentioned, so the
  // client can render preview cards (cover image + name + budget) without a
  // round-trip back to the catalog.
  const mentionedSlugs = new Set<string>();
  for (const m of enrichedReply.matchAll(/\/shop\.html\?concept=([a-z0-9\-]+)/gi)) {
    mentionedSlugs.add(m[1].toLowerCase());
  }
  /* v6: re-extract constraints in this scope (try-block one is out of reach)
     and enforce on returned cards — if user said "до €15k", don't ship cards
     over the cap. Card array drives the preview UI, so this is visible. */
  const constraintsOut = extractConstraints(message, catalogRows);
  const concepts = catalogRows
    .filter(r => mentionedSlugs.has(r.slug.toLowerCase()))
    .filter(r => {
      if (constraintsOut.maxBudget != null && r.budget_eur != null) {
        return r.budget_eur <= constraintsOut.maxBudget;
      }
      return true;
    })
    .map(r => {
      const rich = conceptRich[r.slug];
      return {
        slug: r.slug,
        name: r.name,
        category: r.category,
        country: r.country,
        city: rich?.city ?? null,        // for "Bordeaux, FR" location string
        size_m2: r.size_m2,
        budget_eur: r.budget_eur,
        weeks: rich?.weeks ?? null,      // weeks-to-open badge
        tagline: r.tagline,
        catalog_number: r.catalog_number,
        href: `/view.html?c=${r.slug}`,
        // hero_image from public_verified_catalog already encodes the
        // "[good]" suffix correctly as %20%5Bgood%5D — use it verbatim.
        cover: r.hero_image,
      };
    });

  return json({ reply: enrichedReply, concepts, model: res.model, provider });
});
