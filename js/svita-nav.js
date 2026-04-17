/* SVITA MICRO — shared nav across all pages.
   Renders into <nav id="nav"></nav>. Reads Supabase session and swaps
   "Log in / Sign up" for an avatar dropdown (Cabinet / Favorites / My concepts / Cart / Settings / Sign out).
   Shows a separate cart icon with item counter (localStorage `svita_micro_cart`).
   Lang switcher limited to EN + RU. */
(function(){
  const SB_URL = 'https://ctdleobjnzniqkqomlrq.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZGxlb2JqbnpuaXFrcW9tbHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzE4MTEsImV4cCI6MjA4NzgwNzgxMX0.AMHtY7zGPemKYCxMy2bqRTOEAp8trA_Slor9wmg7C38';

  /* 12 supported languages, alphabetical. Adding a language here requires
     adding a matching LABELS entry, otherwise the nav falls back to EN. */
  const DEFAULT_LANGS = [
    {code:'BE',name:'Беларуская'},
    {code:'DE',name:'Deutsch'},
    {code:'EN',name:'English'},
    {code:'ES',name:'Español'},
    {code:'FR',name:'Français'},
    {code:'IT',name:'Italiano'},
    {code:'JA',name:'日本語'},
    {code:'KO',name:'한국어'},
    {code:'PL',name:'Polski'},
    {code:'PT',name:'Português'},
    {code:'RU',name:'Русский'},
    {code:'UK',name:'Українська'}
  ];
  function getLangList(){
    if(Array.isArray(window.SVITA_LANGS) && window.SVITA_LANGS.length) return window.SVITA_LANGS;
    return DEFAULT_LANGS;
  }
  const LABELS = {
    EN:{shop:'Shop',how:'How it works',signin:'Log in',signup:'Sign up',cabinet:'My cabinet',favs:'Favorites',mine:'My concepts',cart:'Cart',settings:'Settings',signout:'Sign out',admin:'Admin'}
  };

  /* Site is English-only — always return EN regardless of localStorage. */
  function getLang(){ return 'EN'; }

  /* One-shot migration: purge stale lang key from localStorage so no ghost
     overrides creep in from older sessions. */
  try { localStorage.removeItem('svita_micro_lang'); } catch (_) {}
  function getCartCount(){
    try{
      const raw = localStorage.getItem('svita_micro_cart');
      if(!raw) return 0;
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.length : 0;
    }catch(e){ return 0; }
  }
  function getFavCount(){
    if(window.SvitaFavs) return window.SvitaFavs.count();
    try{
      const auth = JSON.parse(localStorage.getItem('svita-micro-auth') || 'null');
      const uid = auth && auth.user && auth.user.id ? auth.user.id : 'anon';
      const raw = localStorage.getItem('svita_micro_favs:' + uid);
      if(!raw) return 0;
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.length : 0;
    }catch(e){ return 0; }
  }

  /* ---------- page + role detection ---------- */
  function currentPage(){
    const p = location.pathname.toLowerCase();
    if(p.endsWith('shop.html')) return 'shop';
    if(p.endsWith('account.html')) return 'account';
    if(p.endsWith('view.html')) return 'view';
    if(p.endsWith('admin.html')) return 'admin';
    if(p.endsWith('edit.html')) return 'edit';
    return 'home';
  }

  function initials(email){
    if(!email) return '?';
    const name = email.split('@')[0] || '';
    const parts = name.split(/[._\-+]/).filter(Boolean);
    if(parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return (name.slice(0,2) || '??').toUpperCase();
  }

  function escape(s){
    return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function injectNavMiniStyles(){
    if(document.getElementById('nav-mini-styles')) return;
    const css = `
      nav{justify-content:flex-start!important}
      nav .brand{margin-right:auto}
      .nav-mini{display:flex;align-items:center;gap:10px}
      .nav-mini .lang{position:relative}
      @media(min-width:641px){
        .nav-mini{margin-left:20px}
      }
      @media(max-width:640px){
        nav{gap:8px}
        .nav-mini{order:2;margin-left:auto;margin-right:6px;z-index:102;position:relative}
        .nav-mini .lang-btn{padding:6px 10px;font-size:11px;border-radius:100px;border:1px solid var(--line,rgba(255,255,255,0.14));background:rgba(255,255,255,0.04);color:var(--text,#fff);display:inline-flex;align-items:center;gap:5px;cursor:pointer;font-family:'JetBrains Mono',monospace;letter-spacing:0.08em;font-weight:600}
        .nav-mini .lang-menu{position:absolute;top:calc(100% + 6px);right:0;background:rgba(10,10,11,0.97);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:8px;display:none;grid-template-columns:repeat(3,1fr);gap:4px;min-width:180px;z-index:103}
        .nav-mini .lang.open .lang-menu{display:grid}
        .nav-mini .lang-menu button{background:none;border:0;color:var(--text,#fff);font-family:'JetBrains Mono',monospace;font-size:11px;padding:8px 6px;border-radius:6px;cursor:pointer;letter-spacing:0.08em}
        .nav-mini .lang-menu button:hover,.nav-mini .lang-menu button.active{background:var(--accent,#D6FF3E);color:#0A0A0B}
        .nav-mini .icon-btn,.nav-mini .cart-icon{width:34px;height:34px;border-radius:50%;border:1px solid var(--line,rgba(255,255,255,0.14));background:rgba(255,255,255,0.04);display:inline-flex;align-items:center;justify-content:center;color:var(--text,#fff);position:relative}
        .nav-mini .cart-count{position:absolute;top:-4px;right:-4px;background:var(--accent,#D6FF3E);color:#0A0A0B;font-size:9px;font-weight:700;border-radius:100px;padding:1px 5px;font-family:'JetBrains Mono',monospace}
      }
    `;
    const style = document.createElement('style');
    style.id = 'nav-mini-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ---------- render ---------- */
  function render(user, opts){
    const nav = document.getElementById('nav');
    if(!nav) return;
    const role = (opts && opts.role) || null; // 'superadmin' | null
    const page = currentPage();
    const lang = getLang();
    const t = LABELS[lang] || LABELS.EN;
    const cartN = getCartCount();

    const shopActive = page === 'shop' ? ' class="active"' : '';
    const navClass = page === 'admin' || page === 'edit' ? ' admin-mode' : '';
    nav.className = navClass.trim();

    // Cart removed: purchases go directly to Stripe/Lemon Squeezy checkout,
    // no multi-item cart concept exists in this app.
    const cartBtn = '';

    // auth area
    let authArea;
    if(user){
      const email = user.email || 'Account';
      const ini = initials(email);
      const roleBadge = role === 'superadmin' ? `<span class="role-tag">${t.admin}</span>` : '';
      const adminLink = role === 'superadmin' ? `<a href="admin.html" role="menuitem"><span class="ic">⚙</span>${t.admin}</a><div class="user-sep"></div>` : '';
      authArea = `
        <div class="user-menu" id="user-menu">
          <button class="user-btn" id="user-btn" aria-haspopup="menu" aria-expanded="false" title="${escape(email)}">
            <span class="user-avatar">${escape(ini)}</span>
            ${roleBadge}
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 1l4 4 4-4"/></svg>
          </button>
          <div class="user-drop" role="menu">
            <div class="user-head">
              <span class="user-avatar lg">${escape(ini)}</span>
              <div class="user-head-txt">
                <span class="user-head-email">${escape(email)}</span>
                ${role === 'superadmin' ? `<span class="user-head-role">${t.admin}</span>` : ''}
              </div>
            </div>
            <div class="user-sep"></div>
            <a href="account.html" role="menuitem"><span class="ic">◱</span>${t.cabinet}</a>
            <a href="account.html#favorites" role="menuitem"><span class="ic">♡</span>${t.favs}</a>
            <a href="account.html#owned" role="menuitem"><span class="ic">▣</span>${t.mine}</a>
            <a href="account.html#settings" role="menuitem"><span class="ic">⚙</span>${t.settings}</a>
            ${adminLink ? `<div class="user-sep"></div>${adminLink}` : ''}
            <div class="user-sep"></div>
            <button type="button" id="nav-signout" role="menuitem"><span class="ic">⎋</span>${t.signout}</button>
          </div>
        </div>`;
    } else {
      authArea = `
        <a href="account.html" class="nav-cta nav-login">${t.signin}</a>
        <a href="account.html?signup=1" class="nav-cta nav-signup">${t.signup}</a>`;
    }

    injectNavMiniStyles();

    nav.innerHTML = `
      <a href="index.html" class="brand">
        <span class="brand-dot"></span>
        SVITA<small>MICRO</small>
      </a>
      <div class="nav-right">
        <a href="shop.html"${shopActive}>${t.shop}</a>
        <a href="index.html#how">${t.how}</a>
        ${authArea}
      </div>
      <div class="nav-mini">
        ${cartBtn}
      </div>
      <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
    `;

    wireEvents();
  }

  /* ---------- events ---------- */
  function wireEvents(){
    const nav = document.getElementById('nav');

    const burger = document.getElementById('burger');
    if(burger){
      burger.addEventListener('click', ()=> document.body.classList.toggle('menu-open'));
      nav.querySelectorAll('.nav-right a').forEach(a=>a.addEventListener('click', ()=> document.body.classList.remove('menu-open')));
    }

    // Language picker removed — site is English-only.

    const userBtn = document.getElementById('user-btn');
    if(userBtn){
      const menu = document.getElementById('user-menu');
      userBtn.addEventListener('click', (e)=>{
        e.stopPropagation();
        const open = menu.classList.toggle('open');
        userBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    const signoutBtn = document.getElementById('nav-signout');
    if(signoutBtn){
      signoutBtn.addEventListener('click', async ()=>{
        try{ await window.__svitaSb.auth.signOut(); }catch(e){}
        location.href = 'index.html';
      });
    }

    document.addEventListener('click', (e)=>{
      if(!e.target.closest('#lang')) lang && lang.classList.remove('open');
      const um = document.getElementById('user-menu');
      if(um && !e.target.closest('#user-menu')) um.classList.remove('open');
    }, { once:false });

    if(!nav.__scrollWired){
      nav.__scrollWired = true;
      window.addEventListener('scroll', ()=> nav.classList.toggle('scrolled', window.scrollY > 20), { passive:true });
    }
  }

  /* ---------- init ---------- */
  async function init(){
    if(!document.getElementById('nav')){
      const n = document.createElement('nav');
      n.id = 'nav';
      document.body.insertBefore(n, document.body.firstChild);
    }

    let sb = window.__svitaSb;
    if(!sb && window.supabase){
      sb = window.supabase.createClient(SB_URL, SB_KEY, { auth:{ persistSession:true, autoRefreshToken:true, storageKey:'svita-micro-auth' } });
      window.__svitaSb = sb;
    }

    let user = null;
    let role = null;
    if(sb){
      try{
        const { data:{ session } } = await sb.auth.getSession();
        user = session && session.user ? session.user : null;
      }catch(e){}
      if(user){
        try{
          const { data } = await sb.from('profiles').select('role').eq('user_id', user.id).maybeSingle();
          role = data && data.role ? data.role : null;
        }catch(e){}
      }
      sb.auth.onAuthStateChange(async (_evt, session)=>{
        const u = session && session.user ? session.user : null;
        let r = null;
        if(u){
          try{
            const { data } = await sb.from('profiles').select('role').eq('user_id', u.id).maybeSingle();
            r = data && data.role ? data.role : null;
          }catch(e){}
        }
        render(u, { role:r });
      });
    }

    // re-render when cart/favs change from other tabs or same tab
    window.addEventListener('storage', (e)=>{
      if(e.key === 'svita_micro_cart' || (e.key && e.key.indexOf('svita_micro_favs') === 0) || e.key === 'svita-micro-auth'){
        render(user, { role });
      }
    });
    window.addEventListener('svita:cart', ()=> render(user, { role }));
    window.addEventListener('svita:favs', ()=> render(user, { role }));

    render(user, { role });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
