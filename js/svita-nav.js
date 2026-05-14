/* SVITA MICRO — shared nav for all internal pages (shop / account /
   generate / admin). Deliberately minimal: the logo on the left, the
   sign-in (or user) pill and the language pill on the right — nothing else.
   The six marketing links live only on the landing (index.html).
   The two pills are styled in svita-ui.css to be byte-identical to the
   landing's React pills, so the header reads the same on every page. */
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
      signin:   L('nav_signin',   'Sign in'),
      cabinet:  L('nav_cabinet',  'My cabinet'),
      favs:     L('nav_favs',     'Favorites'),
      mine:     L('nav_mine',     'My concepts'),
      settings: L('nav_settings', 'Settings'),
      signout:  L('nav_signout',  'Sign out'),
      admin:    L('nav_admin',    'Admin')
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

  /* ---------- styles — self-contained, override per-page nav CSS ---------- */
  function injectNavMiniStyles(){
    if(document.getElementById('nav-mini-styles')) return;
    const css = `
      /* ===== shell — neutralise each page's own nav{} block ===== */
      nav#nav{
        position:fixed!important;top:0!important;left:0!important;right:0!important;
        z-index:100!important;display:block!important;padding:0!important;
        background:rgba(239,234,224,0.7)!important;
        backdrop-filter:blur(12px)!important;-webkit-backdrop-filter:blur(12px)!important;
        border-bottom:1px solid transparent!important;
        transition:background 300ms cubic-bezier(.22,1,.36,1),border-color 300ms cubic-bezier(.22,1,.36,1)!important;
      }
      nav#nav.scrolled{
        background:rgba(239,234,224,0.92)!important;
        backdrop-filter:blur(20px) saturate(160%)!important;
        -webkit-backdrop-filter:blur(20px) saturate(160%)!important;
        border-bottom-color:rgba(47,68,56,0.15)!important;
      }
      nav#nav .nav-inner{
        max-width:80rem;margin:0 auto;width:100%;
        display:flex;align-items:center;justify-content:space-between;gap:16px;
        padding:14px 20px;
        padding-top:calc(14px + env(safe-area-inset-top,0px));
        transition:padding 300ms cubic-bezier(.22,1,.36,1);
      }
      @media(min-width:768px){ nav#nav .nav-inner{padding:16px 48px;padding-top:calc(16px + env(safe-area-inset-top,0px))} }
      nav#nav.scrolled .nav-inner{
        padding-top:calc(12px + env(safe-area-inset-top,0px));padding-bottom:12px;
      }

      /* ===== brand ===== */
      nav#nav .brand{
        display:flex;align-items:center;gap:10px;flex:none;
        text-decoration:none;color:#2F4438;transition:color 200ms ease;
      }
      nav#nav .brand:hover{color:#7A6B3D}
      nav#nav .brand-mark{width:36px;height:36px;flex:none;transition:transform 500ms ease}
      nav#nav .brand:hover .brand-mark{transform:rotate(12deg)}
      nav#nav .brand-word{
        font-family:'Cormorant Garamond',Georgia,serif;font-weight:400;
        font-size:24px;line-height:1;letter-spacing:-0.01em;white-space:nowrap;
      }
      nav#nav .brand-word .dot{color:#7A6B3D;margin:0 2px}
      nav#nav .brand-word i{font-style:italic}
      @media(max-width:640px){
        nav#nav .brand-mark{width:32px;height:32px}
        nav#nav .brand-word{font-size:20px}
      }

      /* ===== right cluster — Shop + login pill + language pill, always visible ===== */
      nav#nav .nav-actions{display:flex;align-items:center;gap:10px;flex:none}
      @media(min-width:641px){ nav#nav .nav-actions{gap:12px} }

      /* highlighted Shop pill — identical to the landing's Shop button */
      nav#nav .nav-shop-pill{
        display:inline-flex;align-items:center;gap:8px;
        padding:10px 16px 10px 20px;border-radius:999px;
        background:#2F4438;color:#EFEAE0;
        font-family:'Inter Tight',system-ui,sans-serif;
        font-size:10px;letter-spacing:0.2em;text-transform:uppercase;font-weight:600;
        text-decoration:none;white-space:nowrap;
        box-shadow:0 2px 8px rgba(15,20,16,0.12);
        transition:background 200ms cubic-bezier(.22,1,.36,1);
      }
      nav#nav .nav-shop-pill:hover{background:#7A6B3D}
      @media(max-width:480px){
        nav#nav .nav-shop-pill{padding:9px 14px;letter-spacing:0.14em}
        nav#nav .nav-shop-pill .arrow{display:none}
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
    const role = (opts && opts.role) || null;
    const page = currentPage();
    const t = getLabels();
    nav.className = (page === 'admin' || page === 'edit') ? 'admin-mode' : '';

    /* auth area — user dropdown OR sign-in pill */
    let authArea;
    if(user){
      const email = user.email || 'Account';
      const ini = initials(email);
      const handle = email.split('@')[0] || 'you';
      const roleBadge = role === 'superadmin' ? `<span class="role-tag">${escape(t.admin)}</span>` : '';
      const adminLink = role === 'superadmin'
        ? `<a href="admin.html" role="menuitem"><span class="ic">⚙</span><span data-i18n="nav_admin">${escape(t.admin)}</span></a><div class="user-sep"></div>`
        : '';
      authArea = `
        <div class="user-menu" id="user-menu">
          <button class="user-btn" id="user-btn" aria-haspopup="menu" aria-expanded="false" title="${escape(email)}">
            <span class="user-avatar"><span class="live-dot" aria-hidden="true"></span>${escape(ini)}</span>
            <span class="user-handle">${escape(handle)}</span>
            ${roleBadge}
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 1l4 4 4-4"/></svg>
          </button>
          <div class="user-drop" role="menu">
            <div class="user-head">
              <span class="user-avatar lg">${escape(ini)}</span>
              <div class="user-head-txt">
                <span class="user-head-email">${escape(email)}</span>
                ${role === 'superadmin' ? `<span class="user-head-role">${escape(t.admin)}</span>` : ''}
              </div>
            </div>
            <div class="user-sep"></div>
            <a href="account.html" role="menuitem"><span class="ic">◱</span><span data-i18n="nav_cabinet">${escape(t.cabinet)}</span></a>
            <a href="account.html#favorites" role="menuitem"><span class="ic">♡</span><span data-i18n="nav_favs">${escape(t.favs)}</span></a>
            <a href="account.html#owned" role="menuitem"><span class="ic">▣</span><span data-i18n="nav_mine">${escape(t.mine)}</span></a>
            <a href="account.html#settings" role="menuitem"><span class="ic">⚙</span><span data-i18n="nav_settings">${escape(t.settings)}</span></a>
            ${adminLink ? `<div class="user-sep"></div>${adminLink}` : ''}
            <div class="user-sep"></div>
            <button type="button" id="nav-signout" role="menuitem"><span class="ic">⎋</span><span data-i18n="nav_signout">${escape(t.signout)}</span></button>
          </div>
        </div>`;
    } else {
      authArea = `
        <a href="account.html" class="nav-signin-pill" aria-label="Sign in" title="Sign in">
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

    injectNavMiniStyles();

    nav.innerHTML = `
      <div class="nav-inner">
        <a href="index.html" class="brand" aria-label="micro.svita home">
          <svg class="brand-mark" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="20" y="20" width="160" height="160"/>
            <path d="M100 100 Q 60 60 20 20"/><path d="M100 100 Q 140 60 180 20"/>
            <path d="M100 100 Q 60 140 20 180"/><path d="M100 100 Q 140 140 180 180"/>
            <path d="M100 100 Q 70 100 20 100"/><path d="M100 100 Q 130 100 180 100"/>
            <path d="M100 100 Q 100 70 100 20"/><path d="M100 100 Q 100 130 100 180"/>
            <circle cx="100" cy="100" r="5" fill="currentColor" stroke="none"/>
          </svg>
          <span class="brand-word">micro<span class="dot">·</span><i>svita</i></span>
        </a>
        <div class="nav-actions">
          <a href="shop.html" class="nav-shop-pill"><span data-i18n="nav_shop">Shop</span> <span class="arrow" aria-hidden="true">→</span></a>
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
      menu.querySelectorAll('.user-drop a, .user-drop button').forEach(el=>{
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

    /* re-render when the session changes from another tab */
    window.addEventListener('storage', (e)=>{
      if(e.key === 'svita-micro-auth'){ render(user, { role }); }
    });

    /* re-render nav when the user picks a different language so labels update.
       Guard against re-entry: render() calls labs67i18n.setLang() which fires
       onLangChange, which would otherwise loop back into render() forever. */
    const prevOnLangChange = window.onLangChange;
    let __navInRender = false;
    window.onLangChange = function(lang, dict){
      if(!__navInRender){
        __navInRender = true;
        try{ render(user, { role }); }catch(_){}
        finally{ __navInRender = false; }
      }
      if(typeof prevOnLangChange === 'function') prevOnLangChange(lang, dict);
    };

    render(user, { role });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
