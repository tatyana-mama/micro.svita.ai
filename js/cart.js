/* cart.js — shared shopping cart for SVITA micro.
   Stores set of concept slugs. Hydrates price/name from local catalog.json.
   Requires window.supabase UMD loaded BEFORE this script.
   API:
     await CART.init()
     CART.is(slug)
     CART.add(slug)      // promise<bool>
     CART.remove(slug)   // promise<bool>
     CART.toggle(slug)   // promise<bool>
     CART.list()         // array of slugs
     CART.count()        // number
     CART.total()        // sum of price_eur (based on catalog snapshot)
     CART.mount(root)    // rewire buttons .add-cart[data-cart="slug"]
     document.addEventListener('cart:change', e => ...)
*/
(function(){
  const SB_URL = 'https://ctdleobjnzniqkqomlrq.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZGxlb2JqbnpuaXFrcW9tbHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzE4MTEsImV4cCI6MjA4NzgwNzgxMX0.AMHtY7zGPemKYCxMy2bqRTOEAp8trA_Slor9wmg7C38';
  const LS_KEY = 'svita_cart_v1';
  const CAT_KEY = 'svita_cat_snap_v1';

  const state = {
    sb: null,
    user: null,
    set: new Set(),
    catalog: {},  // slug -> {price_eur, name}
    ready: false,
  };

  function emit(){
    document.dispatchEvent(new CustomEvent('cart:change', {detail: {
      count: state.set.size, total: total(), list: [...state.set]
    }}));
  }

  function readLocal(){
    try { return new Set(JSON.parse(localStorage.getItem(LS_KEY) || '[]')); }
    catch(e){ return new Set(); }
  }
  function writeLocal(){
    localStorage.setItem(LS_KEY, JSON.stringify([...state.set]));
  }

  async function loadCatalogSnap(){
    // Try memory, then localStorage, then fetch
    try{
      const cached = JSON.parse(localStorage.getItem(CAT_KEY) || 'null');
      if(cached && cached.t && (Date.now() - cached.t) < 1000*60*30){
        state.catalog = cached.d; return;
      }
    }catch(e){}
    try{
      const r = await fetch('data/catalog.json',{cache:'no-store'});
      const arr = await r.json();
      const map = {};
      arr.forEach(c => map[c.slug] = {price_eur:c.price_eur, name:c.name});
      state.catalog = map;
      localStorage.setItem(CAT_KEY, JSON.stringify({t:Date.now(), d:map}));
    }catch(e){
      // fallback: try relative path for nested pages
      try{
        const r = await fetch('../data/catalog.json');
        const arr = await r.json();
        const map = {};
        arr.forEach(c => map[c.slug] = {price_eur:c.price_eur, name:c.name});
        state.catalog = map;
      }catch(e2){}
    }
  }

  async function mergeLocalIntoDB(){
    const local = readLocal();
    if(!local.size || !state.user) return;
    const rows = [...local].map(slug => ({user_id: state.user.id, concept_slug: slug}));
    const {error} = await state.sb.from('cart').upsert(rows, {onConflict:'user_id,concept_slug'});
    if(!error){ localStorage.removeItem(LS_KEY); }
  }

  async function init(){
    if(state.ready) return;
    await loadCatalogSnap();
    if(window.supabase){
      state.sb = window.supabase.createClient(SB_URL, SB_KEY);
      try{
        const {data:{session}} = await state.sb.auth.getSession();
        state.user = session ? session.user : null;
      }catch(e){}
      if(state.user){
        await mergeLocalIntoDB();
        const {data, error} = await state.sb.from('cart')
          .select('concept_slug').eq('user_id', state.user.id);
        if(!error && data) state.set = new Set(data.map(r=>r.concept_slug));
      } else {
        state.set = readLocal();
      }
    } else {
      state.set = readLocal();
    }
    state.ready = true;
    mount(document);
    emit();
  }

  function is(slug){ return state.set.has(slug); }
  function list(){ return [...state.set]; }
  function count(){ return state.set.size; }
  function total(){
    let s = 0;
    state.set.forEach(slug => {
      const r = state.catalog[slug];
      if(r && r.price_eur) s += r.price_eur;
    });
    return s;
  }

  async function add(slug){
    if(state.set.has(slug)) return true;
    state.set.add(slug);
    if(state.user && state.sb){
      await state.sb.from('cart').upsert(
        {user_id: state.user.id, concept_slug: slug},
        {onConflict:'user_id,concept_slug'}
      );
    } else { writeLocal(); }
    mount(document); emit();
    return true;
  }

  async function remove(slug){
    if(!state.set.has(slug)) return false;
    state.set.delete(slug);
    if(state.user && state.sb){
      await state.sb.from('cart').delete()
        .eq('user_id', state.user.id).eq('concept_slug', slug);
    } else { writeLocal(); }
    mount(document); emit();
    return false;
  }

  async function toggle(slug){
    return state.set.has(slug) ? remove(slug) : add(slug);
  }

  function mount(root){
    const btns = (root || document).querySelectorAll('.add-cart[data-cart]');
    btns.forEach(btn => {
      const slug = btn.dataset.cart;
      const inCart = state.set.has(slug);
      btn.classList.toggle('in', inCart);
      const label = btn.querySelector('.label');
      if(label) label.textContent = inCart ? 'In cart' : (btn.dataset.addLabel || 'Add to cart');
      if(btn._cartBound) return;
      btn._cartBound = true;
      btn.addEventListener('click', async (e)=>{
        e.preventDefault();
        e.stopPropagation();
        btn.disabled = true;
        await toggle(slug);
        btn.disabled = false;
      });
    });
  }

  window.CART = { init, is, add, remove, toggle, list, count, total, mount, state };
})();
