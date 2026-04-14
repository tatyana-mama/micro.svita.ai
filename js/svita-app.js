/* SVITA MICRO — mobile app shell.
   Injects bottom tab bar and registers PWA service-worker-less install hints.
   No-op on desktop (CSS hides #app-tabbar for >720px). */
(function(){
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const isHome = here === '' || here === 'index.html';
  const isShop = here === 'shop.html';
  const isAcc  = here === 'account.html';

  const TABS = [
    { id:'home',  href:'index.html',   label:'Home',    active:isHome,
      svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 11l9-8 9 8v10a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2V11z" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { id:'shop',  href:'shop.html',    label:'Shop',    active:isShop,
      svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 7h18l-1.5 12a2 2 0 0 1-2 1.7H6.5a2 2 0 0 1-2-1.7L3 7z" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 7V5a4 4 0 0 1 8 0v2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { id:'acc',   href:'account.html', label:'Cabinet', active:isAcc,
      svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.2-4.5 4.4-7 8-7s6.8 2.5 8 7" stroke-linecap="round"/></svg>' },
  ];

  function render(){
    if(document.getElementById('app-tabbar')) return;
    const bar = document.createElement('nav');
    bar.id = 'app-tabbar';
    bar.setAttribute('aria-label','App navigation');
    bar.innerHTML = TABS.map(t => (
      `<a href="${t.href}" class="${t.active?'active':''}" data-tab="${t.id}">
         ${t.svg}
         <span>${t.label}</span>
       </a>`
    )).join('');
    document.body.appendChild(bar);

    // Cart badge on Shop tab (reads localStorage cart count)
    try{
      const raw = localStorage.getItem('svita_micro_cart');
      const count = raw ? (JSON.parse(raw)||[]).length : 0;
      if(count > 0){
        const shopA = bar.querySelector('[data-tab="shop"]');
        const b = document.createElement('span');
        b.className = 'badge';
        b.textContent = String(count);
        shopA.appendChild(b);
      }
    }catch(_){}
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
