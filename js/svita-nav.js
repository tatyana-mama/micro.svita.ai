/* SVITA MICRO — shared nav across all pages.
   Renders into <nav id="nav"></nav>. Reads Supabase session and swaps
   "Log in / Sign up" for an avatar dropdown (Cabinet / Favorites / My concepts / Cart / Settings / Sign out).
   Shows a separate cart icon with item counter (localStorage `svita_micro_cart`).
   Lang switcher limited to EN + RU. */
(function(){
  const SB_URL = 'https://ctdleobjnzniqkqomlrq.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZGxlb2JqbnpuaXFrcW9tbHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzE4MTEsImV4cCI6MjA4NzgwNzgxMX0.AMHtY7zGPemKYCxMy2bqRTOEAp8trA_Slor9wmg7C38';

  /* Default lang set — pages can override by defining window.SVITA_LANGS
     as [{code:'EN',name:'English'}, ...] before loading this script. */
  const DEFAULT_LANGS = [{code:'EN',name:'English'},{code:'RU',name:'Русский'}];
  function getLangList(){
    if(Array.isArray(window.SVITA_LANGS) && window.SVITA_LANGS.length) return window.SVITA_LANGS;
    return DEFAULT_LANGS;
  }
  const LABELS = {
    EN: { shop:'Shop', how:'How it works', signin:'Log in', signup:'Sign up',
          cabinet:'My cabinet', favs:'Favorites', mine:'My concepts', cart:'Cart', settings:'Settings', signout:'Sign out',
          admin:'Admin' },
    RU: { shop:'Магазин', how:'Как работает', signin:'Войти', signup:'Регистрация',
          cabinet:'Мой кабинет', favs:'Избранные', mine:'Мои концепции', cart:'Корзина', settings:'Настройки', signout:'Выйти',
          admin:'Админ' }
  };

  /* ---------- localStorage helpers ---------- */
  function getLang(){
    const list = getLangList().map(l=>l.code.toUpperCase());
    const stored = (localStorage.getItem('svita_micro_lang')||'').toUpperCase();
    if(stored && list.includes(stored)) return stored;
    const b = (navigator.language||'en').split('-')[0].toUpperCase();
    return list.includes(b) ? b : list[0];
  }
  function getCartCount(){
    try{
      const raw = localStorage.getItem('svita_micro_cart');
      if(!raw) return 0;
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.length : 0;
    }catch(e){ return 0; }
  }
  function getFavCount(){
    try{
      const raw = localStorage.getItem('svita_micro_favs');
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

  /* ---------- render ---------- */
  function render(user, opts){
    const nav = document.getElementById('nav');
    if(!nav) return;
    const role = (opts && opts.role) || null; // 'superadmin' | null
    const page = currentPage();
    const lang = getLang();
    const t = LABELS[lang];
    const cartN = getCartCount();

    const shopActive = page === 'shop' ? ' class="active"' : '';
    const navClass = page === 'admin' || page === 'edit' ? ' admin-mode' : '';
    nav.className = navClass.trim();

    // cart icon (visible always)
    const cartBadge = cartN > 0 ? `<span class="cart-count">${cartN}</span>` : '';
    const cartBtn = `
      <a href="account.html#cart" class="icon-btn cart-icon" aria-label="${t.cart}" title="${t.cart}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h2l.4 2M7 13h12l3-8H6.4M7 13L5.4 5M7 13l-2 4h14"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>
        ${cartBadge}
      </a>`;

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
            <a href="account.html#cart" role="menuitem"><span class="ic">⊞</span>${t.cart}${cartN>0?` <span class="mi-count">${cartN}</span>`:''}</a>
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

    nav.innerHTML = `
      <a href="index.html" class="brand">
        <span class="brand-dot"></span>
        SVITA<small>MICRO</small>
      </a>
      <div class="nav-right">
        <a href="shop.html"${shopActive}>${t.shop}</a>
        <a href="index.html#how">${t.how}</a>
        <div class="lang" id="lang">
          <button class="lang-btn" type="button" aria-label="Language">
            <span id="lang-current">${lang}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 1l4 4 4-4"/></svg>
          </button>
          <div class="lang-menu">
            ${getLangList().map(l=>{
              const c = l.code.toUpperCase();
              const title = l.name ? ` title="${escape(l.name)}"` : '';
              return `<button type="button" data-lang="${c}"${title}${c===lang?' class="active"':''}>${c}</button>`;
            }).join('')}
          </div>
        </div>
        ${cartBtn}
        ${authArea}
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

    const lang = document.getElementById('lang');
    const langBtn = lang && lang.querySelector('.lang-btn');
    if(langBtn){
      langBtn.addEventListener('click', (e)=>{ e.stopPropagation(); lang.classList.toggle('open'); });
      lang.querySelectorAll('.lang-menu button').forEach(b=>{
        b.addEventListener('click', ()=>{
          const code = b.dataset.lang;
          localStorage.setItem('svita_micro_lang', code);
          if(typeof window.setLang === 'function') window.setLang(code);
          else location.reload();
        });
      });
    }

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
      if(e.key === 'svita_micro_cart' || e.key === 'svita_micro_favs'){
        render(user, { role });
      }
    });
    window.addEventListener('svita:cart', ()=> render(user, { role }));

    render(user, { role });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
