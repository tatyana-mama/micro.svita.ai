/* SVITA MICRO — shared header for all internal pages
   (shop / account / generate / admin / subscribe).
   Renders into <nav id="nav"></nav>: logo on the left, the highlighted Shop
   pill + the sign-in/user pill + the language pill on the right — nothing else.
   ALL styling lives in css/svita-header.css — the SAME file the landing uses,
   so the header is pixel-identical on every page. This script only builds the
   markup and wires behaviour; it must not contain header CSS. */
(function(){
  const SB_URL = 'https://ctdleobjnzniqkqomlrq.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZGxlb2JqbnpuaXFrcW9tbHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzE4MTEsImV4cCI6MjA4NzgwNzgxMX0.AMHtY7zGPemKYCxMy2bqRTOEAp8trA_Slor9wmg7C38';

  /* Nav labels from window.I18N (svita-i18n-dict.js) with English fallback. */
  function L(key, fallback){
    const dict = window.I18N || {};
    const lang = (window.labs67i18n && window.labs67i18n.getLang && window.labs67i18n.getLang()) || 'en';
    const entry = dict[key];
    if(!entry) return fallback;
    return entry[lang] || entry.en || fallback;
  }
  function getLabels(){
    return {
      signin:    L('nav_signin',    'Sign in'),
      cabinet:   L('nav_cabinet',   'My cabinet'),
      favs:      L('nav_favs',      'Favorites'),
      mine:      L('nav_mine',      'My concepts'),
      settings:  L('nav_settings',  'Settings'),
      signout:   L('nav_signout',   'Sign out'),
      admin:     L('nav_admin',     'Admin'),
      subscribe: L('nav_subscribe', 'Subscribe')
    };
  }

  function currentPage(){
    const p = location.pathname.toLowerCase();
    if(p.endsWith('shop.html')) return 'shop';
    if(p.endsWith('generate.html')) return 'generate';
    if(p.endsWith('account.html')) return 'account';
    if(p.endsWith('view.html')) return 'view';
    if(p.endsWith('admin.html')) return 'admin';
    if(p.endsWith('edit.html')) return 'edit';
    if(p.endsWith('subscribe.html')) return 'subscribe';
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

  /* Ensure the canonical header stylesheet is loaded exactly once. */
  function ensureHeaderCSS(){
    if(document.querySelector('link[data-svita-header]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/svita-header.css';
    link.setAttribute('data-svita-header', '');
    document.head.appendChild(link);
  }

  /* ---------- render ---------- */
  function render(user, opts){
    const nav = document.getElementById('nav');
    if(!nav) return;
    const role = (opts && opts.role) || null;
    const hasAccess = !!(opts && opts.hasAccess);
    const page = currentPage();
    const t = getLabels();
    nav.className = (page === 'admin' || page === 'edit') ? 'admin-mode' : '';

    /* Subscribe affordance — shown until the visitor actually has library
       access. As a header pill (after Shop) AND inside the cabinet dropdown. */
    const subscribePill = hasAccess ? '' :
      `<a href="/subscribe.html" class="svh-subscribe" data-i18n="nav_subscribe">${escape(t.subscribe)}</a>`;
    const subscribeMenuItem = hasAccess ? '' :
      `<a href="/subscribe.html" role="menuitem"><span class="ic">✦</span><span data-i18n="nav_subscribe">${escape(t.subscribe)}</span></a><div class="svh-sep"></div>`;

    /* auth area — user dropdown OR sign-in pill */
    let authArea;
    if(user){
      const email = user.email || 'Account';
      const ini = initials(email);
      const handle = email.split('@')[0] || 'you';
      const roleBadge = role === 'superadmin' ? `<span class="svh-role">${escape(t.admin)}</span>` : '';
      const adminLink = role === 'superadmin'
        ? `<a href="/admin.html" role="menuitem"><span class="ic">⚙</span><span data-i18n="nav_admin">${escape(t.admin)}</span></a><div class="svh-sep"></div>`
        : '';
      authArea = `
        <div class="svh-user" id="user-menu">
          <button class="svh-user-btn" id="user-btn" aria-haspopup="menu" aria-expanded="false" title="${escape(email)}">
            <span class="svh-avatar"><span class="live-dot" aria-hidden="true"></span>${escape(ini)}</span>
            <span class="svh-handle">${escape(handle)}</span>
            ${roleBadge}
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 1l4 4 4-4"/></svg>
          </button>
          <div class="svh-drop" role="menu">
            <div class="svh-drop-head">
              <span class="svh-avatar lg">${escape(ini)}</span>
              <div class="svh-drop-head-txt">
                <span class="svh-drop-email">${escape(email)}</span>
                ${role === 'superadmin' ? `<span class="svh-drop-role">${escape(t.admin)}</span>` : ''}
              </div>
            </div>
            <div class="svh-sep"></div>
            ${subscribeMenuItem}
            <a href="/account.html" role="menuitem"><span class="ic">◱</span><span data-i18n="nav_cabinet">${escape(t.cabinet)}</span></a>
            <a href="account.html#favorites" role="menuitem"><span class="ic">♡</span><span data-i18n="nav_favs">${escape(t.favs)}</span></a>
            <a href="account.html#owned" role="menuitem"><span class="ic">▣</span><span data-i18n="nav_mine">${escape(t.mine)}</span></a>
            <a href="account.html#settings" role="menuitem"><span class="ic">⚙</span><span data-i18n="nav_settings">${escape(t.settings)}</span></a>
            ${adminLink ? `<div class="svh-sep"></div>${adminLink}` : ''}
            <div class="svh-sep"></div>
            <button type="button" id="nav-signout" role="menuitem"><span class="ic">⎋</span><span data-i18n="nav_signout">${escape(t.signout)}</span></button>
          </div>
        </div>`;
    } else {
      authArea = `
        <a href="/account.html" class="svh-signin" aria-label="Sign in" title="Sign in">
          <span class="icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>
            </svg>
          </span>
          <span data-i18n="nav_signin">${escape(t.signin)}</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" style="opacity:0.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </a>`;
    }

    ensureHeaderCSS();

    nav.innerHTML = `
      <div class="svh-inner">
        <a href="/" class="svh-brand" aria-label="micro.svita home">
          <svg class="svh-brand-mark" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="20" y="20" width="160" height="160"/>
            <path d="M100 100 Q 60 60 20 20"/><path d="M100 100 Q 140 60 180 20"/>
            <path d="M100 100 Q 60 140 20 180"/><path d="M100 100 Q 140 140 180 180"/>
            <path d="M100 100 Q 70 100 20 100"/><path d="M100 100 Q 130 100 180 100"/>
            <path d="M100 100 Q 100 70 100 20"/><path d="M100 100 Q 100 130 100 180"/>
            <circle cx="100" cy="100" r="5" fill="currentColor" stroke="none"/>
          </svg>
          <span class="svh-brand-word">micro<span class="dot">·</span><i>svita</i></span>
        </a>
        <div class="svh-actions">
          <a href="/shop.html" class="svh-shop"><span data-i18n="nav_shop">Shop</span> <span class="arrow" aria-hidden="true">→</span></a>
          ${subscribePill}
          ${authArea}
          <div class="lang-switcher" aria-label="Language"></div>
        </div>
      </div>
    `;

    /* Re-build the language switcher we just injected (labs67-i18n.js only
       auto-builds those present at DOMContentLoaded) and re-apply the active
       language so data-i18n nodes inside the freshly injected nav update. */
    if (window.labs67i18n && typeof window.__labs67BuildSwitchers === 'function') {
      window.__labs67BuildSwitchers();
      try { window.labs67i18n.setLang(window.labs67i18n.getLang()); } catch (e) {}
    }

    wireEvents();
  }

  /* ---------- events ---------- */
  function wireEvents(){
    const nav = document.getElementById('nav');

    const userBtn = document.getElementById('user-btn');
    if(userBtn && !userBtn.__wired){
      userBtn.__wired = true;
      const menu = document.getElementById('user-menu');
      const toggle = (e)=>{
        if (e) { e.preventDefault(); e.stopPropagation(); }
        const open = menu.classList.toggle('open');
        userBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      };
      userBtn.addEventListener('pointerdown', toggle);
      userBtn.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); });
      menu.querySelectorAll('.svh-drop a, .svh-drop button').forEach(el=>{
        el.addEventListener('click', ()=> menu.classList.remove('open'));
      });
    }

    const signoutBtn = document.getElementById('nav-signout');
    if(signoutBtn){
      signoutBtn.addEventListener('click', async ()=>{
        try{ await window.__svitaSb.auth.signOut(); }catch(e){}
        location.href = 'index.html';
      });
    }

    if(!document.__navEscWired){
      document.__navEscWired = true;
      document.addEventListener('keydown', (e)=>{
        if(e.key === 'Escape'){
          const um = document.getElementById('user-menu');
          if(um) um.classList.remove('open');
        }
      });
    }

    if(!document.__navOutsideWired){
      document.__navOutsideWired = true;
      document.addEventListener('click', (e)=>{
        const um = document.getElementById('user-menu');
        if(um && !e.target.closest('#user-menu')) um.classList.remove('open');
      });
    }

    if(!nav.__scrollWired){
      nav.__scrollWired = true;
      window.addEventListener('scroll', ()=>{
        nav.classList.toggle('scrolled', window.scrollY > 12);
      }, { passive:true });
      nav.classList.toggle('scrolled', window.scrollY > 12);
    }
  }

  /* ---------- init ---------- */
  async function init(){
    if(!document.getElementById('nav')){
      const n = document.createElement('nav');
      n.id = 'nav';
      document.body.insertBefore(n, document.body.firstChild);
    }
    ensureHeaderCSS();

    let sb = window.__svitaSb;
    if(!sb && window.supabase){
      sb = window.supabase.createClient(SB_URL, SB_KEY, { auth:{ persistSession:true, autoRefreshToken:true, storageKey:'svita-micro-auth' } });
      window.__svitaSb = sb;
    }

    let user = null;
    let role = null;
    let hasAccess = false;

    /* Resolve role + library-access for a user in one place. */
    async function resolveAccess(u){
      let r = null, access = false;
      if(u){
        try{
          const { data } = await sb.from('profiles').select('role').eq('user_id', u.id).maybeSingle();
          r = data && data.role ? data.role : null;
        }catch(e){}
        try{
          const { data } = await sb.rpc('has_library_access', { p_user_id: u.id });
          access = data === true;
        }catch(e){}
        if(r === 'superadmin' || r === 'admin') access = true;
      }
      return { role:r, hasAccess:access };
    }

    if(sb){
      try{
        const { data:{ session } } = await sb.auth.getSession();
        user = session && session.user ? session.user : null;
      }catch(e){}
      if(user){
        const a = await resolveAccess(user);
        role = a.role; hasAccess = a.hasAccess;
      }
      sb.auth.onAuthStateChange(async (_evt, session)=>{
        const u = session && session.user ? session.user : null;
        const a = await resolveAccess(u);
        render(u, { role:a.role, hasAccess:a.hasAccess });
      });
    }

    /* re-render when the session changes from another tab */
    window.addEventListener('storage', (e)=>{
      if(e.key === 'svita-micro-auth'){ render(user, { role, hasAccess }); }
    });

    /* re-render nav when the user picks a different language so labels update.
       Guard against re-entry: render() calls labs67i18n.setLang() which fires
       onLangChange, which would otherwise loop back into render() forever. */
    const prevOnLangChange = window.onLangChange;
    let __navInRender = false;
    window.onLangChange = function(lang, dict){
      if(!__navInRender){
        __navInRender = true;
        try{ render(user, { role, hasAccess }); }catch(_){}
        finally{ __navInRender = false; }
      }
      if(typeof prevOnLangChange === 'function') prevOnLangChange(lang, dict);
    };

    render(user, { role, hasAccess });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
