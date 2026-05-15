/* svita-advisor.js — reusable AI concierge button + drawer.
 *
 * Drop-in: any page that does <script src="/js/svita-advisor.js" defer></script>
 * gets a floating round button (bottom-right) and a side-drawer chat panel
 * that POSTs to the shop-advisor edge function. Self-contained styling,
 * no external dependencies, no framework.
 *
 * The single source of truth is the `shop-advisor` Supabase function — it
 * knows the entire catalog, so the advisor answers consistently regardless
 * of which page the visitor opens it from.
 *
 * If the function is unreachable (deploy pending, network down) the panel
 * shows a graceful "leave email" fallback instead of pretending to chat.
 */

/* ── canonical-header upgrade for legacy concept pages ──────────────────────
 * The presentation pages (presentations/NN-slug/index.html) are generated
 * artefacts that still carry the old hand-built <header class="topbar">.
 * Rather than editing 90+ QA-locked files, we swap that legacy header for
 * the SAME canonical header every other page uses: drop in <nav id="nav">,
 * load css/svita-header.css + svita-nav.js, and let svita-nav.js render it.
 * Net effect — concept pages get the identical logo / Shop / sign-in / lang
 * header, wired to the shared svita-micro-auth session (so a signed-in
 * visitor is recognised, no second login prompt in the bar). Runs before the
 * advisor IIFE so the load-once guard never blocks it. */
(function upgradeLegacyConceptHeader(){
  const legacy = document.querySelector('header.topbar');
  if (!legacy || document.getElementById('nav')) return;

  const nav = document.createElement('nav');
  nav.id = 'nav';
  legacy.replaceWith(nav);

  if (!document.querySelector('link[data-svita-header]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = '/css/svita-header.css';
    css.setAttribute('data-svita-header', '');
    document.head.appendChild(css);
  }

  function loadScript(src){
    return new Promise((resolve) => {
      if (document.querySelector('script[src="' + src + '"]')) { resolve(); return; }
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = resolve;
      document.body.appendChild(s);
    });
  }

  /* svita-nav.js reads window.I18N (svita-i18n-dict.js) and window.labs67i18n
     (labs67-i18n.js) for the language pill — load them first, in order. */
  (async () => {
    if (!window.I18N)        await loadScript('/js/svita-i18n-dict.js');
    if (!window.labs67i18n)  await loadScript('/js/labs67-i18n.js');
    await loadScript('/js/svita-nav.js');
  })();
})();

(function () {
  if (window.__svitaAdvisor) return;       // load once
  if (document.getElementById('advisor-launch')) return; // shop.html has its own
  window.__svitaAdvisor = true;

  const ENDPOINT = 'https://ctdleobjnzniqkqomlrq.supabase.co/functions/v1/shop-advisor';
  const ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZGxlb2JqbnpuaXFrcW9tbHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzE4MTEsImV4cCI6MjA4NzgwNzgxMX0.AMHtY7zGPemKYCxMy2bqRTOEAp8trA_Slor9wmg7C38';

  /* Quick-prompt chips were removed — they distracted more than they helped.
     The textarea placeholder still nudges what to type. */

  const css = `
    .sv-advisor-fab{
      position:fixed; right:20px; bottom:20px; z-index:9000;
      width:56px; height:56px; border-radius:50%;
      background:#2F4438; color:#EFEAE0; border:0; cursor:pointer;
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 18px 40px -12px rgba(15,20,16,0.5), 0 4px 10px rgba(15,20,16,0.18);
      transition:transform .2s ease, box-shadow .2s ease, background .25s ease;
      font-family:'Cormorant Garamond',Georgia,serif;
    }
    .sv-advisor-fab:hover{ transform:translateY(-2px) scale(1.04); background:#7A6B3D; }
    .sv-advisor-fab svg{ width:24px; height:24px }
    .sv-advisor-fab .sv-dot{ position:absolute; top:8px; right:8px; width:8px; height:8px; border-radius:50%; background:#C9A97A }

    .sv-advisor-panel{
      position:fixed; right:20px; bottom:88px; z-index:9001;
      width:min(380px, calc(100vw - 32px)); max-height:min(70vh, 640px);
      display:none; flex-direction:column;
      background:#F6F1E6; border:1px solid rgba(47,68,56,0.18); border-radius:18px;
      box-shadow:0 30px 80px -20px rgba(15,20,16,0.45), 0 8px 22px -10px rgba(15,20,16,0.2);
      overflow:hidden; font-family:'Inter Tight',system-ui,sans-serif;
      animation:sv-rise 240ms cubic-bezier(.22,.61,.36,1);
    }
    body.sv-advisor-open .sv-advisor-panel{ display:flex }
    @keyframes sv-rise{ from{ opacity:0; transform:translateY(12px) } to{ opacity:1; transform:none } }

    .sv-advisor-head{
      display:flex; align-items:center; gap:10px; padding:14px 16px;
      background:#2F4438; color:#EFEAE0;
    }
    .sv-advisor-head .sv-title{ font-family:'Cormorant Garamond',Georgia,serif; font-weight:500; font-size:17px; flex:1; line-height:1.1 }
    .sv-advisor-head .sv-title small{ display:block; font:300 11px/1.3 'Inter Tight',system-ui; opacity:.7; letter-spacing:.04em }
    .sv-advisor-head .sv-close{ background:none; border:0; color:#EFEAE0; cursor:pointer; padding:4px; opacity:.7; border-radius:6px }
    .sv-advisor-head .sv-close:hover{ opacity:1; background:rgba(255,255,255,0.08) }

    .sv-advisor-log{
      flex:1; overflow-y:auto; padding:16px;
      display:flex; flex-direction:column; gap:10px;
      background:#F6F1E6; color:#0F1410; font-size:13.5px; line-height:1.55;
    }
    .sv-msg{ max-width:88%; padding:9px 12px; border-radius:12px; white-space:pre-wrap; word-wrap:break-word }
    .sv-msg.assistant{ background:#EFEAE0; align-self:flex-start; border:1px solid rgba(47,68,56,0.08) }
    .sv-msg.user{ background:#2F4438; color:#EFEAE0; align-self:flex-end }
    .sv-msg a{ color:inherit; text-decoration:underline; text-underline-offset:2px }
    .sv-msg .sv-slug-row{ display:inline-flex; align-items:center; gap:6px; margin-top:6px; padding:6px 10px; border-radius:100px; background:rgba(47,68,56,0.08); font-size:12px }

    /* concept preview cards — clickable, hi-res cover, compact info */
    .sv-cards{ display:flex; flex-direction:column; gap:8px; margin-top:10px }
    .sv-card{
      display:flex; gap:12px; padding:8px;
      background:#EFEAE0; border:1px solid rgba(47,68,56,0.12); border-radius:12px;
      text-decoration:none; color:inherit;
      transition:transform .2s ease, box-shadow .2s ease, border-color .2s ease;
    }
    .sv-card:hover{
      transform:translateY(-1px);
      box-shadow:0 12px 24px -12px rgba(15,20,16,0.25);
      border-color:rgba(122,107,61,0.4);
    }
    .sv-card-cover{
      flex:none; width:88px; height:88px; border-radius:10px;
      background:#CEC2AD center/cover no-repeat;
      filter:saturate(1.06) contrast(1.03);
    }
    .sv-card-body{ flex:1; min-width:0; display:flex; flex-direction:column; justify-content:center; gap:3px }
    .sv-card-name{
      font:500 15px/1.2 'Cormorant Garamond',Georgia,serif;
      color:#2F4438; letter-spacing:.005em;
      overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
    }
    .sv-card-tagline{
      font:italic 400 12.5px/1.4 'Cormorant Garamond',Georgia,serif;
      color:#5F6870;
      display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;
      overflow:hidden; max-height:2.8em;
    }
    .sv-card-meta{
      font-size:11px; color:#5F6870; line-height:1.3;
      display:flex; gap:8px; flex-wrap:wrap; align-items:center;
      margin-top:1px;
    }
    .sv-card-meta .dot{ color:rgba(47,68,56,0.3) }
    .sv-card-budget{ font-weight:600; color:#7A6B3D }
    .sv-card-arrow{ flex:none; align-self:center; color:#7A6B3D; font-size:18px; line-height:1; padding-right:4px }
    .sv-typing{ display:inline-flex; gap:4px; padding:9px 12px; background:#EFEAE0; border-radius:12px; align-self:flex-start }
    .sv-typing span{ width:6px; height:6px; border-radius:50%; background:rgba(47,68,56,0.4); animation:sv-blink 1.2s infinite }
    .sv-typing span:nth-child(2){ animation-delay:.15s } .sv-typing span:nth-child(3){ animation-delay:.3s }
    @keyframes sv-blink{ 0%,80%,100%{ opacity:.3 } 40%{ opacity:1 } }

    .sv-advisor-form{ display:flex; gap:8px; padding:12px 14px; border-top:1px solid rgba(47,68,56,0.12); background:#F6F1E6 }
    .sv-advisor-form textarea{
      flex:1; resize:none; height:44px; max-height:120px; padding:11px 12px;
      font:14px/1.4 'Inter Tight',system-ui; color:#0F1410;
      background:#EFEAE0; border:1px solid rgba(47,68,56,0.2); border-radius:10px;
      outline:none;
    }
    .sv-advisor-form textarea:focus{ border-color:#7A6B3D }
    .sv-advisor-form button{
      width:44px; height:44px; flex:none; border:0; border-radius:10px;
      background:#2F4438; color:#EFEAE0; cursor:pointer;
      display:flex; align-items:center; justify-content:center;
      transition:background .2s ease;
    }
    .sv-advisor-form button:hover{ background:#7A6B3D }
    .sv-advisor-form button:disabled{ opacity:.4; cursor:not-allowed }

    .sv-fallback{
      padding:14px; margin:12px 16px; border-radius:12px;
      background:#FFF6E0; border:1px solid #E8C97A;
      font-size:13px; color:#5A4310;
    }
    .sv-fallback a{ color:#5A4310; font-weight:500 }

    @media (max-width:520px){
      .sv-advisor-panel{ right:12px; left:12px; bottom:84px; width:auto; max-height:75vh }
      .sv-advisor-fab{ right:16px; bottom:16px }
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const fab = document.createElement('button');
  fab.className = 'sv-advisor-fab';
  fab.setAttribute('aria-label', 'Ask the catalog AI');
  fab.title = 'Ask the catalog AI';
  fab.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12a8 8 0 1 1-3.5-6.6L21 4l-1.4 3.5A8 8 0 0 1 21 12z"/>
      <circle cx="9" cy="12" r="1" fill="currentColor"/>
      <circle cx="13" cy="12" r="1" fill="currentColor"/>
      <circle cx="17" cy="12" r="1" fill="currentColor"/>
    </svg>
    <span class="sv-dot" aria-hidden="true"></span>
  `;
  document.body.appendChild(fab);

  const panel = document.createElement('div');
  panel.className = 'sv-advisor-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Catalog AI');
  panel.innerHTML = `
    <div class="sv-advisor-head">
      <div class="sv-title">Catalog concierge<small>tell me your budget & vibe — I'll pick a concept</small></div>
      <button class="sv-close" aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="sv-advisor-log" id="sv-log"></div>
    <form class="sv-advisor-form" id="sv-form">
      <textarea id="sv-input" placeholder="e.g. café in Lisbon under €40k" maxlength="800" rows="1"></textarea>
      <button type="submit" id="sv-send" aria-label="Send">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
      </button>
    </form>
  `;
  document.body.appendChild(panel);

  const log = panel.querySelector('#sv-log');
  const form = panel.querySelector('#sv-form');
  const input = panel.querySelector('#sv-input');
  const sendBtn = panel.querySelector('#sv-send');
  const closeBtn = panel.querySelector('.sv-close');

  /* Persist conversation across page navigations and tab restarts so the
     visitor can browse shop → concept → account and keep talking to the same
     assistant. Each USER gets their own history bucket — when logged in we
     key by Supabase user.id; when anonymous we mint a per-browser id and
     stick to it. Different users on the same browser never see each other's
     conversation. */
  const HISTORY_MAX = 40;
  function anonId() {
    try {
      let a = localStorage.getItem('svita_anon_id');
      if (!a) { a = 'a_' + Math.random().toString(36).slice(2, 12) + Date.now().toString(36); localStorage.setItem('svita_anon_id', a); }
      return a;
    } catch (e) { return 'a_session'; }
  }
  function currentUserId() {
    try {
      const raw = localStorage.getItem('svita-micro-auth');
      if (!raw) return null;
      const sess = JSON.parse(raw);
      return sess?.user?.id || sess?.currentSession?.user?.id || null;
    } catch (e) { return null; }
  }
  function historyKey() {
    const uid = currentUserId();
    return 'svita_advisor_history_v2_' + (uid || anonId());
  }
  let HISTORY_KEY = historyKey();
  let history = [];
  function loadHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.slice(-HISTORY_MAX) : [];
    } catch (e) { return []; }
  }
  history = loadHistory();
  function persistHistory() {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-HISTORY_MAX)));
    } catch (e) { /* quota or sandbox — silent */ }
  }
  /* Cross-tab sync: when the SAME user updates history in another tab,
     mirror it here. On auth change (login/logout) the bucket key changes —
     we MIGRATE the current in-memory conversation into the new bucket so
     the visitor never sees the chat go blank just because they signed in. */
  window.addEventListener('storage', (e) => {
    if (e.key === 'svita-micro-auth') {
      const newKey = historyKey();
      if (newKey === HISTORY_KEY) return;
      /* Migrate: prefer the longer of (current in-memory) vs (already-saved
         in new bucket). This way a fresh login doesn't wipe a conversation
         the visitor was in the middle of having. */
      let nextSaved = [];
      try {
        const raw = localStorage.getItem(newKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) nextSaved = parsed.slice(-HISTORY_MAX);
        }
      } catch (_) {}
      const merged = (history.length >= nextSaved.length) ? history : nextSaved;
      HISTORY_KEY = newKey;
      history = merged.slice(-HISTORY_MAX);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch (_) {}
      return;
    }
    if (e.key === HISTORY_KEY && e.newValue) {
      try {
        const next = JSON.parse(e.newValue);
        if (Array.isArray(next)) history = next.slice(-HISTORY_MAX);
      } catch (_) {}
    }
  });

  function open() {
    document.body.classList.add('sv-advisor-open');
    setTimeout(() => input.focus(), 80);
    if (history.length) {
      // Replay saved turns into the panel so the visitor sees the full
      // conversation when they reopen the assistant.
      log.innerHTML = '';
      const snapshot = history.slice();
      history = [];
      for (const m of snapshot) addMsg(m.role, m.content, m.concepts);
    } else {
      seedGreeting();
    }
  }
  function close() { document.body.classList.remove('sv-advisor-open'); }

  fab.addEventListener('click', () => {
    if (document.body.classList.contains('sv-advisor-open')) close(); else open();
  });
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains('sv-advisor-open')) close();
  });

  // Auto-grow textarea up to max-height.
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });
  // Enter-to-send, Shift+Enter for newline.
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
  });

  // Quick prompts row removed — they were noise. Visitor types freely.

  function seedGreeting() {
    addMsg('assistant',
      "Hi — I'm the catalog concierge. Tell me what you'd like to open (city, budget, vibe) and I'll pick one or two concepts that fit. "
      + "Or hit a chip below for a quick start."
    );
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Strip the bare `→ /shop.html?concept=slug` markers from the prose body —
  // we'll render them as rich cards below instead.
  function stripSlugLines(text, slugs) {
    if (!slugs || !slugs.size) return text;
    let out = text;
    for (const slug of slugs) {
      const re = new RegExp(`^\\s*→?\\s*\\/shop\\.html\\?concept=${slug}\\s*$`, 'gim');
      out = out.replace(re, '');
    }
    // Also collapse triple newlines created by the strip.
    return out.replace(/\n{3,}/g, '\n\n').trim();
  }

  function renderConceptCard(c) {
    const meta = [];
    if (c.category) meta.push(`<span>${escapeHtml(c.category)}</span>`);
    if (c.country)  meta.push(`<span>${escapeHtml(c.country)}</span>`);
    if (c.size_m2)  meta.push(`<span>${escapeHtml(c.size_m2)} m²</span>`);
    if (c.budget_eur) {
      const k = Math.round(c.budget_eur / 1000);
      meta.push(`<span class="sv-card-budget">~€${k}k open</span>`);
    }
    const metaHtml = meta.join('<span class="dot">·</span>');
    const cover = c.cover ? `style="background-image:url('${escapeHtml(c.cover)}')"` : '';
    const tagline = c.tagline
      ? `<div class="sv-card-tagline">${escapeHtml(c.tagline)}</div>`
      : '';
    return `
      <a class="sv-card" href="${escapeHtml(c.href || '/view.html?c=' + c.slug)}" target="_top">
        <div class="sv-card-cover" ${cover} aria-hidden="true"></div>
        <div class="sv-card-body">
          <div class="sv-card-name">${escapeHtml(c.name || c.slug)}</div>
          ${tagline}
          <div class="sv-card-meta">${metaHtml}</div>
        </div>
        <span class="sv-card-arrow" aria-hidden="true">→</span>
      </a>`;
  }

  function addMsg(role, text, concepts) {
    history.push({ role, content: text, concepts: concepts || [] });
    persistHistory();
    const el = document.createElement('div');
    el.className = 'sv-msg ' + role;

    const conceptSlugs = new Set((concepts || []).map(c => c.slug.toLowerCase()));
    const cleaned = role === 'assistant' ? stripSlugLines(text, conceptSlugs) : text;

    // Linkify any remaining inline `/shop.html?concept=slug` mentions (for
    // models that didn't put the link on its own line). Also escape HTML.
    const inlineLinked = escapeHtml(cleaned)
      .replace(/(→\s*)?\/shop\.html\?concept=([a-z0-9\-]+)/gi,
        (_m, _arrow, slug) => `<a class="sv-slug-row" href="/view.html?c=${slug}" target="_top">→ ${slug}</a>`);

    let html = inlineLinked.replace(/\n/g, '<br>');
    if (concepts && concepts.length) {
      html += `<div class="sv-cards">${concepts.map(renderConceptCard).join('')}</div>`;
    }
    el.innerHTML = html;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'sv-typing'; t.id = 'sv-typing-now';
    t.innerHTML = '<span></span><span></span><span></span>';
    log.appendChild(t);
    log.scrollTop = log.scrollHeight;
    return t;
  }
  function clearTyping() {
    const t = document.getElementById('sv-typing-now');
    if (t) t.remove();
  }

  function showFallback() {
    const f = document.createElement('div');
    f.className = 'sv-fallback';
    f.innerHTML =
      `The AI concierge is rebooting — usually back within an hour.<br>` +
      `Meanwhile email <a href="mailto:hi@svita.ai?subject=micro.svita%20question">hi@svita.ai</a> and a founder will reply.`;
    log.appendChild(f);
    log.scrollTop = log.scrollHeight;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const msg = input.value.trim();
    if (!msg) return;
    addMsg('user', msg);
    input.value = ''; input.style.height = 'auto';
    sendBtn.disabled = true;
    const typing = showTyping();

    try {
      const r = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: ANON_KEY },
        body: JSON.stringify({
          message: msg,
          // Server keeps only last 12 turns — send the most recent slice.
          history: history.filter(h => h.role !== 'assistant' || h.content).slice(-13, -1),
        }),
      });
      clearTyping();
      if (!r.ok) {
        // Don't surface raw error JSON to the visitor — degrade gracefully.
        console.warn('advisor', r.status, await r.text().catch(() => ''));
        showFallback();
        return;
      }
      const data = await r.json();
      const reply = (data && data.reply) ? String(data.reply).trim() : '';
      const concepts = (data && Array.isArray(data.concepts)) ? data.concepts : [];
      if (reply) addMsg('assistant', reply, concepts);
      else showFallback();
    } catch (err) {
      clearTyping();
      console.warn('advisor', err);
      showFallback();
    } finally {
      sendBtn.disabled = false;
    }
  });
})();
