/* SVITA MICRO — shared favorites store.
   localStorage key: svita_micro_favs (array of concept slugs).
   Fires window event 'svita:favs' after every change so nav/account re-render.
   Works anonymously — no auth required. */
(function(){
  const KEY = 'svita_micro_favs';

  function read(){
    try{
      const raw = localStorage.getItem(KEY);
      if(!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    }catch(e){ return []; }
  }
  function write(arr){
    localStorage.setItem(KEY, JSON.stringify(arr));
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
    count(){ return read().length; }
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
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paint);
  else paint();
})();
