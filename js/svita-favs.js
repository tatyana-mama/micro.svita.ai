/* SVITA MICRO — shared favorites store.
   localStorage key: svita_micro_favs:{user_id|anon} — scoped per user so
   different accounts in the same browser don't leak favorites into each other.
   Fires window event 'svita:favs' after every change so nav/account re-render.
   Works anonymously — no auth required. */
(function(){
  const BASE = 'svita_micro_favs';
  const AUTH_KEY = 'svita-micro-auth';

  function currentUserId(){
    try{
      const raw = localStorage.getItem(AUTH_KEY);
      if(!raw) return null;
      const obj = JSON.parse(raw);
      return obj && obj.user && obj.user.id ? obj.user.id : null;
    }catch(e){ return null; }
  }
  function getKey(){
    const uid = currentUserId();
    return BASE + ':' + (uid || 'anon');
  }

  function read(){
    try{
      const raw = localStorage.getItem(getKey());
      if(!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    }catch(e){ return []; }
  }
  function write(arr){
    localStorage.setItem(getKey(), JSON.stringify(arr));
    window.dispatchEvent(new CustomEvent('svita:favs', { detail:{ favs:arr } }));
  }

  const SvitaFavs = {
    list(){ return read(); },
    has(slug){ return read().includes(slug); },
    add(slug){
      const arr = read();
      if(!arr.includes(slug)){ arr.push(slug); write(arr); }
      return arr;
    },
    remove(slug){
      const arr = read().filter(s => s !== slug);
      write(arr);
      return arr;
    },
    toggle(slug){
      return read().includes(slug) ? SvitaFavs.remove(slug) : SvitaFavs.add(slug);
    },
    count(){ return read().length; },
    key(){ return getKey(); }
  };

  window.SvitaFavs = SvitaFavs;

  /* Delegated click: any element with data-fav="SLUG" toggles. */
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-fav]');
    if(!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const slug = btn.getAttribute('data-fav');
    if(!slug) return;
    SvitaFavs.toggle(slug);
    const active = SvitaFavs.has(slug);
    btn.classList.toggle('on', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  }, true);

  /* On load, mark any [data-fav] buttons already in the DOM. */
  function paint(){
    document.querySelectorAll('[data-fav]').forEach(btn=>{
      const slug = btn.getAttribute('data-fav');
      const active = SvitaFavs.has(slug);
      btn.classList.toggle('on', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }
  window.addEventListener('svita:favs', paint);

  /* Re-paint when auth changes in another tab or via Supabase storage write. */
  window.addEventListener('storage', (e)=>{
    if(e.key === AUTH_KEY){
      window.dispatchEvent(new CustomEvent('svita:favs', { detail:{ favs: read() } }));
    }
  });

  /* Re-paint after Supabase auth state change in same tab (login/logout). */
  function hookAuth(){
    try{
      const sb = window.__svitaSb;
      if(sb && sb.auth && sb.auth.onAuthStateChange){
        sb.auth.onAuthStateChange(()=>{
          window.dispatchEvent(new CustomEvent('svita:favs', { detail:{ favs: read() } }));
        });
        return true;
      }
    }catch(e){}
    return false;
  }
  if(!hookAuth()){
    let tries = 0;
    const iv = setInterval(()=>{ if(hookAuth() || ++tries > 20) clearInterval(iv); }, 250);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paint);
  else paint();
})();
