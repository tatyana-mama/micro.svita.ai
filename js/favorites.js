/* favorites.js — shared favorites store for SVITA micro
   Requires window.supabase (UMD) to be loaded BEFORE this script.
   Usage:
     await FAV.init();               // populates set, wires <button.heart data-fav="slug"> elements
     FAV.is(slug)                    // bool
     FAV.toggle(slug)                // promise<bool> new state
     FAV.mount(root)                 // re-wires buttons inside a container (after re-render)
     document.addEventListener('fav:change', e=>{...}) // e.detail = {slug, active}
*/
(function(){
  const SB_URL = 'https://ctdleobjnzniqkqomlrq.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZGxlb2JqbnpuaXFrcW9tbHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzE4MTEsImV4cCI6MjA4NzgwNzgxMX0.AMHtY7zGPemKYCxMy2bqRTOEAp8trA_Slor9wmg7C38';
  const LS_KEY = 'svita_favs_v1';

  const state = {
    sb: null,
    user: null,
    set: new Set(),
    ready: false,
  };

  function emit(slug, active){
    document.dispatchEvent(new CustomEvent('fav:change', {detail:{slug, active}}));
  }

  function readLocal(){
    try { return new Set(JSON.parse(localStorage.getItem(LS_KEY) || '[]')); }
    catch(e){ return new Set(); }
  }
  function writeLocal(){
    localStorage.setItem(LS_KEY, JSON.stringify([...state.set]));
  }

  async function mergeLocalIntoDB(){
    const local = readLocal();
    if(!local.size || !state.user) return;
    const rows = [...local].map(slug => ({user_id: state.user.id, concept_slug: slug}));
    const {error} = await state.sb.from('favorites').upsert(rows, {onConflict:'user_id,concept_slug'});
    if(!error){ localStorage.removeItem(LS_KEY); }
  }

  async function init(){
    if(state.ready) return;
    if(!window.supabase){ console.warn('[FAV] supabase-js not loaded'); state.set = readLocal(); }
    else {
      state.sb = window.supabase.createClient(SB_URL, SB_KEY);
      try{
        const {data:{session}} = await state.sb.auth.getSession();
        state.user = session ? session.user : null;
      }catch(e){}
      if(state.user){
        await mergeLocalIntoDB();
        const {data, error} = await state.sb.from('favorites')
          .select('concept_slug').eq('user_id', state.user.id);
        if(!error && data) state.set = new Set(data.map(r=>r.concept_slug));
      } else {
        state.set = readLocal();
      }
    }
    state.ready = true;
    mount(document);
  }

  function is(slug){ return state.set.has(slug); }

  async function toggle(slug){
    const active = !state.set.has(slug);
    if(active) state.set.add(slug); else state.set.delete(slug);
    // Persist
    if(state.user && state.sb){
      if(active){
        await state.sb.from('favorites').upsert(
          {user_id: state.user.id, concept_slug: slug},
          {onConflict:'user_id,concept_slug'}
        );
      } else {
        await state.sb.from('favorites').delete()
          .eq('user_id', state.user.id).eq('concept_slug', slug);
      }
    } else {
      writeLocal();
    }
    mount(document);
    emit(slug, active);
    return active;
  }

  function mount(root){
    const btns = (root || document).querySelectorAll('.heart[data-fav]');
    btns.forEach(btn => {
      const slug = btn.dataset.fav;
      btn.classList.toggle('on', state.set.has(slug));
      btn.setAttribute('aria-pressed', state.set.has(slug) ? 'true' : 'false');
      if(btn._favBound) return;
      btn._favBound = true;
      btn.addEventListener('click', async (e)=>{
        e.preventDefault();
        e.stopPropagation();
        if(!state.user && !window.supabase){
          // local fallback still works
        } else if(!state.user){
          // Not logged in: allow guest favs via localStorage
        }
        btn.disabled = true;
        await toggle(slug);
        btn.disabled = false;
      });
    });
  }

  window.FAV = { init, is, toggle, mount, state };
})();
