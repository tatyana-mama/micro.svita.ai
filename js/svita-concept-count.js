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
    /* Catch-all: walk every text node in the document body and substitute
       the {N} placeholder wherever it appears. {N} is unique enough that
       this is safe — never appears as content elsewhere. Catches both
       data-i18n elements (whose innerHTML was filled from dict) AND React
       JSX templates that set innerHTML via dangerouslySetInnerHTML. */
    if (document.body) {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          const p = node.parentNode;
          if (!p) return NodeFilter.FILTER_REJECT;
          const tag = (p.nodeName || '').toLowerCase();
          if (tag === 'script' || tag === 'style' || tag === 'noscript') return NodeFilter.FILTER_REJECT;
          return node.nodeValue && node.nodeValue.indexOf('{N}') !== -1
            ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });
      const pending = [];
      let node;
      while ((node = walker.nextNode())) pending.push(node);
      for (const n of pending) n.nodeValue = n.nodeValue.replace(/\{N\}/g, N);
    }
    /* Expose an event so other components (chat advisor system prompt, etc.)
       can listen and react when the count loads or changes. */
    window.dispatchEvent(new CustomEvent('svita:concept-count', { detail: { count: n } }));
  }

  /* React (and any other client-side renderer) may paint nodes AFTER our
     initial walker ran — those new text nodes still carry literal "{N}".
     A MutationObserver catches every added/changed text node and substitutes
     in place. We keep the substitution surgical (text-node only) so we never
     mutate React's reconciled HTML structure. */
  function observeNewNodes() {
    if (!document.body || !window.MutationObserver) return;
    const sub = (text) => {
      const N = window.__svitaConceptCountValue;
      if (!N) return text;
      return text.indexOf('{N}') !== -1 ? text.replace(/\{N\}/g, String(N)) : text;
    };
    const fixSubtree = (root) => {
      if (!window.__svitaConceptCountValue) return;
      if (root.nodeType === 3) {
        const next = sub(root.nodeValue || '');
        if (next !== root.nodeValue) root.nodeValue = next;
        return;
      }
      if (root.nodeType !== 1) return;
      const tag = (root.nodeName || '').toLowerCase();
      if (tag === 'script' || tag === 'style' || tag === 'noscript') return;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const pending = [];
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeValue && node.nodeValue.indexOf('{N}') !== -1) pending.push(node);
      }
      for (const n of pending) n.nodeValue = sub(n.nodeValue);
    };
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'characterData') {
          const next = sub(m.target.nodeValue || '');
          if (next !== m.target.nodeValue) m.target.nodeValue = next;
        } else if (m.type === 'childList') {
          m.addedNodes.forEach(fixSubtree);
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
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

    /* Start the React/late-paint observer right after the first paint pass. */
    observeNewNodes();

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
