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
  /* shop.html ships a legacy #advisor-launch button (hidden by CSS now); the
     global FAB is the canonical chat everywhere — let it spawn there too. */
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

    /* concept preview cards — editorial covers, clickable, compact info */
    .sv-cards{ display:flex; flex-direction:column; gap:10px; margin-top:12px }
    .sv-card{
      position:relative;
      display:flex; flex-direction:column; gap:0; padding:0;
      background:#EFEAE0; border:1px solid rgba(47,68,56,0.12); border-radius:14px;
      text-decoration:none; color:inherit; overflow:hidden;
      transition:transform .25s cubic-bezier(.22,1,.36,1),
                 box-shadow .25s cubic-bezier(.22,1,.36,1),
                 border-color .25s ease;
    }
    .sv-card:hover{
      transform:translateY(-2px);
      box-shadow:0 16px 32px -16px rgba(15,20,16,0.28);
      border-color:rgba(122,107,61,0.55);
    }
    .sv-card-cover{
      position:relative;
      width:100%; aspect-ratio:16/9;
      background:#CEC2AD center/cover no-repeat;
      filter:saturate(1.05) contrast(1.02);
      transition:transform .6s cubic-bezier(.22,1,.36,1);
    }
    .sv-card-num{
      position:absolute; top:8px; left:8px;
      font:600 9.5px/1 'Inter Tight',system-ui,sans-serif;
      letter-spacing:.08em;
      padding:4px 6px 3px;
      background:rgba(15,20,16,0.5);
      color:#EFEAE0;
      border-radius:3px;
      backdrop-filter:blur(4px);
      -webkit-backdrop-filter:blur(4px);
      z-index:2;
    }
    .sv-card:hover .sv-card-cover{ transform:scale(1.03) }
    .sv-card-body{
      display:flex; flex-direction:column; gap:5px;
      padding:11px 14px 13px;
      border-top:1px solid rgba(47,68,56,0.08);
    }
    .sv-card-name{
      font:500 16px/1.18 'Cormorant Garamond',Georgia,serif;
      color:#2F4438; letter-spacing:-.005em;
      overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
    }
    .sv-card-tagline{
      font:italic 400 13px/1.4 'Cormorant Garamond',Georgia,serif;
      color:#5F6870;
      display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;
      overflow:hidden;
    }
    .sv-card-meta{
      font-size:10.5px; color:rgba(95,104,112,0.85); line-height:1.3;
      letter-spacing:.04em; text-transform:uppercase;
      display:flex; gap:6px; flex-wrap:wrap; align-items:center;
      margin-top:3px;
    }
    .sv-card-meta > span:not(.sv-card-budget):not(.dot){ font-weight:500 }
    .sv-card-meta .dot{ color:rgba(47,68,56,0.25); letter-spacing:0 }
    .sv-card-budget{ font-weight:700; color:#7A6B3D; letter-spacing:0; text-transform:none }
    .sv-card-arrow{
      position:absolute; top:10px; right:10px; z-index:2;
      width:28px; height:28px; border-radius:50%;
      background:rgba(47,68,56,0.9); color:#EFEAE0;
      display:inline-flex; align-items:center; justify-content:center;
      font-size:13px; line-height:1;
      box-shadow:0 4px 10px rgba(15,20,16,0.25);
      transform:translateY(-2px); opacity:0;
      transition:opacity .2s ease, transform .2s ease;
    }
    .sv-card:hover .sv-card-arrow{ opacity:1; transform:translateY(0) }
    @media(hover:none){ .sv-card-arrow{ opacity:1; transform:translateY(0) } }
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

  /* All visible advisor copy goes through these dicts so the panel speaks
     the active site locale. Falls back to English when the dict is missing. */
  const ADV_COPY = {
    title: {
      en: 'Catalog concierge', ru: 'Консьерж каталога',
      pl: 'Konsjerż katalogu', uk: 'Консьєрж каталогу', be: 'Кансьерж каталогу'
    },
    subtitle: {
      en: "tell me your budget & vibe — I'll pick a concept",
      ru: 'расскажите бюджет и настроение — подберу концепцию',
      pl: 'powiedz mi swój budżet i klimat — wybiorę koncept',
      uk: 'розкажіть бюджет і настрій — підберу концепцію',
      be: 'раскажыце бюджэт і настрой — падбяру канцэпцыю'
    },
    placeholder: {
      en: 'e.g. café in Lisbon under €40k',
      ru: 'напр. кофейня в Лиссабоне до €40k',
      pl: 'np. kawiarnia w Lizbonie do €40k',
      uk: 'напр. кав\'ярня в Лісабоні до €40k',
      be: 'напр. кавярня ў Лісабоне да €40k'
    },
    close: { en:'Close', ru:'Закрыть', pl:'Zamknij', uk:'Закрити', be:'Закрыць' },
    send:  { en:'Send',  ru:'Отправить', pl:'Wyślij', uk:'Надіслати', be:'Адправіць' },
    ariaLabel: { en:'Catalog AI', ru:'AI каталога', pl:'AI katalogu', uk:'AI каталогу', be:'AI каталогу' }
  };
  function advLang(){ try { return localStorage.getItem('labs67lang') || 'en'; } catch(_) { return 'en'; } }
  function advT(key){ const r = ADV_COPY[key]; if (!r) return ''; return r[advLang()] || r.en; }

  const panel = document.createElement('div');
  panel.className = 'sv-advisor-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', advT('ariaLabel'));
  panel.innerHTML = `
    <div class="sv-advisor-head">
      <div class="sv-title"><span class="sv-title-main">${advT('title')}</span><small>${advT('subtitle')}</small></div>
      <button class="sv-close" aria-label="${advT('close')}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="sv-advisor-log" id="sv-log"></div>
    <form class="sv-advisor-form" id="sv-form">
      <textarea id="sv-input" placeholder="${advT('placeholder')}" maxlength="800" rows="1"></textarea>
      <button type="submit" id="sv-send" aria-label="${advT('send')}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
      </button>
    </form>
  `;
  document.body.appendChild(panel);

  /* Refresh advisor copy whenever the visitor flips the language pill. */
  function repaintAdvisorCopy(){
    const titleMain = panel.querySelector('.sv-title-main');
    const titleSmall = panel.querySelector('.sv-title small');
    const closeBtn2 = panel.querySelector('.sv-close');
    const inputEl = panel.querySelector('#sv-input');
    const sendBtn2 = panel.querySelector('#sv-send');
    if (titleMain) titleMain.textContent = advT('title');
    if (titleSmall) titleSmall.textContent = advT('subtitle');
    if (closeBtn2) closeBtn2.setAttribute('aria-label', advT('close'));
    if (inputEl) inputEl.setAttribute('placeholder', advT('placeholder'));
    if (sendBtn2) sendBtn2.setAttribute('aria-label', advT('send'));
    panel.setAttribute('aria-label', advT('ariaLabel'));
  }
  const _prevAdvLang = window.onLangChange;
  window.onLangChange = function(lang, dict){
    if (typeof _prevAdvLang === 'function') {
      try { _prevAdvLang(lang, dict); } catch(_) {}
    }
    repaintAdvisorCopy();
  };

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

  /* Server-side persistence. Authenticated users get their chat stored in
     public.advisor_history (one row per user_id, RLS-locked to auth.uid()).
     localStorage stays as a fast offline cache + the only path for anon
     visitors. Cross-device chat sync flows through the server. */
  const SB_URL = 'https://ctdleobjnzniqkqomlrq.supabase.co';
  const SB_ANON =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZGxlb2JqbnpuaXFrcW9tbHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzE4MTEsImV4cCI6MjA4NzgwNzgxMX0.AMHtY7zGPemKYCxMy2bqRTOEAp8trA_Slor9wmg7C38';
  function authToken() {
    try {
      const raw = localStorage.getItem('svita-micro-auth');
      if (!raw) return null;
      const sess = JSON.parse(raw);
      return sess?.access_token || sess?.currentSession?.access_token || null;
    } catch (_) { return null; }
  }
  async function pullServerHistory() {
    const uid = currentUserId(); const tok = authToken();
    if (!uid || !tok) return null;
    try {
      const r = await fetch(
        `${SB_URL}/rest/v1/advisor_history?select=history&user_id=eq.${uid}`,
        { headers: { apikey: SB_ANON, Authorization: `Bearer ${tok}`, Accept: 'application/json' } }
      );
      if (!r.ok) return null;
      const arr = await r.json();
      const remote = Array.isArray(arr?.[0]?.history) ? arr[0].history.slice(-HISTORY_MAX) : null;
      return remote;
    } catch (_) { return null; }
  }
  let pushTimer = null;
  function schedulePush() {
    const uid = currentUserId(); const tok = authToken();
    if (!uid || !tok) return;
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(async () => {
      try {
        await fetch(`${SB_URL}/rest/v1/advisor_history?on_conflict=user_id`, {
          method: 'POST',
          headers: {
            apikey: SB_ANON,
            Authorization: `Bearer ${tok}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates,return=minimal',
          },
          body: JSON.stringify({
            user_id: uid,
            history: history.slice(-HISTORY_MAX),
            updated_at: new Date().toISOString(),
          }),
        });
      } catch (_) { /* offline / network — localStorage still has it */ }
    }, 600);
  }

  function persistHistory() {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-HISTORY_MAX)));
    } catch (e) { /* quota or sandbox — silent */ }
    schedulePush();
  }

  /* On boot: if the visitor is logged in, pull the server copy and merge —
     longer of (local, remote) wins. Then push the merged version back so
     both sides converge. Runs once. */
  (async () => {
    const remote = await pullServerHistory();
    if (!remote) return;
    if (remote.length > history.length) {
      history = remote.slice(-HISTORY_MAX);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch (_) {}
      /* If the panel is already open, rebuild it from the server snapshot. */
      if (document.body.classList.contains('sv-advisor-open')) {
        const log = document.querySelector('#sv-log');
        if (log) {
          log.innerHTML = '';
          const snap = history.slice();
          history = [];
          for (const m of snap) addMsg(m.role, m.content, m.concepts);
        }
      }
    } else if (history.length > remote.length) {
      schedulePush();
    }
  })();
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
    /* Premium meta row — editorial number badge, city+country, size, budget,
       weeks-to-open. Each piece is its own span; dots are visual separators. */
    const meta = [];
    if (c.category) meta.push(`<span>${escapeHtml(c.category)}</span>`);
    /* Combine city + country if both present (e.g. "Bordeaux, FR"). Falls back
       to country code alone if city not in payload. */
    const loc = c.city && c.country ? `${c.city}, ${c.country}` : (c.city || c.country || '');
    if (loc) meta.push(`<span>${escapeHtml(loc)}</span>`);
    if (c.size_m2)  meta.push(`<span>${escapeHtml(c.size_m2)} m²</span>`);
    if (c.weeks)    meta.push(`<span>${escapeHtml(c.weeks)} w</span>`);
    if (c.budget_eur) {
      const k = Math.round(c.budget_eur / 1000);
      meta.push(`<span class="sv-card-budget">~€${k}k open</span>`);
    }
    const metaHtml = meta.join('<span class="dot">·</span>');
    const cover = c.cover ? `style="background-image:url('${escapeHtml(c.cover)}')"` : '';
    const tagline = c.tagline
      ? `<div class="sv-card-tagline">${escapeHtml(c.tagline)}</div>`
      : '';
    /* Catalog-number ribbon: small editorial #042 in top-left of the cover.
       Reinforces "this is a curated library, not a generic template gallery." */
    const numBadge = (c.catalog_number != null)
      ? `<span class="sv-card-num">#${String(c.catalog_number).padStart(3, '0')}</span>`
      : '';
    return `
      <a class="sv-card" href="${escapeHtml(c.href || '/view.html?c=' + c.slug)}" target="_top">
        <div class="sv-card-cover" ${cover} aria-hidden="true">${numBadge}</div>
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
        headers: {
          'Content-Type': 'application/json',
          // Prefer SSE; FAQ/pricing shortcuts still return application/json.
          'Accept': 'text/event-stream, application/json',
          apikey: ANON_KEY,
        },
        body: JSON.stringify({
          message: msg,
          // Send the last ~16 turns of context. The just-added user message
          // is the last element in `history` (we addMsg'd it before fetch),
          // so .slice(-17, -1) gives the 16 preceding turns and drops the
          // duplicate — the server already adds `message` to the turn list.
          history: history.filter(h => h.role !== 'assistant' || h.content).slice(-17, -1),
        }),
      });
      if (!r.ok) {
        clearTyping();
        // Don't surface raw error JSON to the visitor — degrade gracefully.
        console.warn('advisor', r.status, await r.text().catch(() => ''));
        showFallback();
        return;
      }
      const ct = (r.headers.get('content-type') || '').toLowerCase();
      if (ct.includes('application/json')) {
        // FAQ/pricing shortcut — server bypassed the LLM and returned full JSON.
        clearTyping();
        const data = await r.json().catch(() => ({}));
        const reply = (data && data.reply) ? String(data.reply).trim() : '';
        const concepts = (data && Array.isArray(data.concepts)) ? data.concepts : [];
        if (reply) addMsg('assistant', reply, concepts);
        else showFallback();
      } else {
        /* SSE token-stream — render incrementally, finalize on `done` event.
           Event schema:
             event: meta   → {model, provider}
             (default)     → {chunk:"…"}                 — N times
             event: done   → {reply, concepts, ...}      — post-validator final
             event: error  → {status, body}
           The `done` event REPLACES the streamed buffer because the server's
           SLUG / ANCHOR validators may have stripped hallucinated slugs that
           briefly flashed through as chunks during streaming. */
        clearTyping();
        const liveEl = document.createElement('div');
        liveEl.className = 'sv-msg assistant sv-streaming';
        log.appendChild(liveEl);
        log.scrollTop = log.scrollHeight;
        const reader = r.body.getReader();
        const decoder = new TextDecoder();
        let buf = '';
        let streamed = '';
        let finalReply = null;
        let finalConcepts = [];
        let errorPayload = null;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const parts = buf.split('\n\n');
          buf = parts.pop() || '';
          for (const part of parts) {
            if (!part.trim()) continue;
            let event = 'message';
            let dataStr = '';
            for (const line of part.split('\n')) {
              if (line.startsWith('event: ')) event = line.slice(7).trim();
              else if (line.startsWith('data: ')) dataStr = line.slice(6);
            }
            if (!dataStr) continue;
            let payload;
            try { payload = JSON.parse(dataStr); } catch (_) { continue; }
            if (event === 'done') {
              finalReply = (payload.reply && String(payload.reply).trim()) || '';
              finalConcepts = Array.isArray(payload.concepts) ? payload.concepts : [];
            } else if (event === 'error') {
              errorPayload = payload;
            } else if (event === 'meta') {
              /* optional model/provider info — currently no UI hook */
            } else if (typeof payload.chunk === 'string') {
              streamed += payload.chunk;
              // Plain-text incremental render — final pass will linkify + cards.
              liveEl.textContent = streamed;
              log.scrollTop = log.scrollHeight;
            }
          }
        }
        // Remove the live bubble; addMsg renders the finalized one with
        // validators applied + concept cards attached + history persistence.
        liveEl.remove();
        if (errorPayload) {
          console.warn('advisor SSE error', errorPayload);
          showFallback();
        } else if (finalReply) {
          addMsg('assistant', finalReply, finalConcepts);
        } else if (streamed) {
          // No `done` event but we did receive chunks — render what we have.
          addMsg('assistant', streamed, []);
        } else {
          showFallback();
        }
      }
    } catch (err) {
      clearTyping();
      console.warn('advisor', err);
      showFallback();
    } finally {
      sendBtn.disabled = false;
    }
  });
})();
