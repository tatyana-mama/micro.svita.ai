/* svita-concept-count.js — single source of truth for the "N concepts"
 * count shown on every page. Reads the real number from the
 * public_verified_catalog Supabase view, then rewrites every element that
 * declared itself a counter, so adding a new concept to the DB updates
 * all surface text automatically — no hardcoded numbers in markup.
 *
 * Markup contracts:
 *   <span data-concept-count>91</span>
 *       → text content becomes the real number (fallback shown until load).
 *
 *   <p data-concept-count-template="A library of {N} concepts">
 *       A library of 91 concepts
 *   </p>
 *       → innerHTML rewritten with {N} replaced by the real number.
 *
 * Caches the value in sessionStorage for the rest of the page-load journey
 * so we don't hit the network 7 times during a single session.
 */
(function () {
  if (window.__svitaConceptCount) return;
  window.__svitaConceptCount = true;

  const SB_URL = 'https://ctdleobjnzniqkqomlrq.supabase.co';
  const SB_ANON =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZGxlb2JqbnpuaXFrcW9tbHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzE4MTEsImV4cCI6MjA4NzgwNzgxMX0.AMHtY7zGPemKYCxMy2bqRTOEAp8trA_Slor9wmg7C38';
  const CACHE_KEY = 'svita_concept_count_v1';
  const CACHE_TTL_MS = 5 * 60 * 1000; // 5 min

  function escape(s){
    return String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  }

  function applyCount(n) {
    if (typeof n !== 'number' || !isFinite(n) || n <= 0) return;
    window.__svitaConceptCountValue = n;
    const N = String(n);
    document.querySelectorAll('[data-concept-count]').forEach(el => {
      el.textContent = N;
    });
    document.querySelectorAll('[data-concept-count-template]').forEach(el => {
      const tpl = el.getAttribute('data-concept-count-template') || '';
      el.innerHTML = tpl.replace(/\{N\}/g, escape(N));
    });
    /* Expose an event so other components (chat advisor system prompt, etc.)
       can listen and react when the count loads or changes. */
    window.dispatchEvent(new CustomEvent('svita:concept-count', { detail: { count: n } }));
  }

  async function fetchCount() {
    /* sessionStorage cache for the page-load journey. */
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.n && Date.now() - parsed.t < CACHE_TTL_MS) return parsed.n;
      }
    } catch (e) {}
    try {
      const r = await fetch(`${SB_URL}/rest/v1/public_verified_catalog?select=slug&limit=1`, {
        headers: {
          apikey: SB_ANON,
          Authorization: `Bearer ${SB_ANON}`,
          Prefer: 'count=exact',
          Range: '0-0',
        },
      });
      const range = r.headers.get('content-range') || ''; // e.g. "0-0/91"
      const m = range.match(/\/(\d+)/);
      if (m) {
        const n = parseInt(m[1], 10);
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ n, t: Date.now() })); } catch (e) {}
        return n;
      }
    } catch (e) {}
    return null;
  }

  function init() {
    /* Paint whatever's cached immediately so the page never shows stale
       hardcoded text, then refresh in the background. */
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.n) applyCount(parsed.n);
      }
    } catch (e) {}
    fetchCount().then(n => { if (n) applyCount(n); });

    /* Re-apply after every language change — labs67-i18n.js sets innerHTML
       from the dictionary (which carries the {N} placeholder), so we have
       to substitute again with the real number after each language flip. */
    const prev = window.onLangChange;
    window.onLangChange = function (lang, dict) {
      if (typeof prev === 'function') {
        try { prev(lang, dict); } catch (_) {}
      }
      if (window.__svitaConceptCountValue) applyCount(window.__svitaConceptCountValue);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
