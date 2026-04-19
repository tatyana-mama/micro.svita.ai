window.SvitaCard = (function(){
  'use strict';

  const CAT_PAL = {
    food:['#1a2e1a','#2d4a2d','🌿'], restaurant:['#2e1a1a','#4a2d2d','🍽'],
    beauty:['#2e1a2a','#4a2d44','💋'], service:['#1a1e2e','#2d334a','✦'],
    repair:['#2e2a1a','#4a422d','⚙'], craft:['#251a2e','#3d2d4a','◆'],
    retail:['#1a2e2a','#2d4a44','▲'], wellness:['#1a2e2e','#2d4a4a','○'],
    health:['#1a2a2e','#2d3e4a','+'], education:['#2e281a','#4a402d','✎']
  };

  const CAT_LABELS = {
    food:'Food', restaurant:'Restaurant', beauty:'Beauty', service:'Service',
    repair:'Repair', craft:'Craft', retail:'Retail', wellness:'Wellness',
    health:'Health', education:'Education'
  };

  function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  function isPh(img){ return !img || (typeof img === 'string' && img.startsWith('placeholder:')); }

  function visual(c){
    const pal = CAT_PAL[c.category] || ['#1a1a1f','#2a2a30','◆'];
    if(isPh(c.hero_image)){
      return '<div class="sc-ph" style="--ph-a:'+pal[0]+';--ph-b:'+pal[1]+'">'+pal[2]+'</div>';
    }
    return '<div class="sc-img" style="background-image:url(\''+esc(c.hero_image)+'\')"></div>';
  }

  function catLabel(cat){ return CAT_LABELS[cat] || cat || '—'; }

  function shopCard(c, opts){
    opts = opts || {};
    const owned = opts.owned || false;
    const slug = c.slug || c.concept_slug || '';
    const vis = visual(c);
    const price = (c.current_price_eur != null) ? c.current_price_eur : (c.price_eur||0);
    const archived = !!c.archived;
    const priceBlock = owned
      ? '<span class="sc-owned-tag">Owned</span>'
      : (archived
          ? '<span class="sc-price sc-archived-price">Sold out</span>'
          : '<span class="sc-price">€'+price+'</span>');
    const numBadge = (c.catalog_number != null)
      ? '<span class="sc-num">#' + String(c.catalog_number).padStart(3,'0') + '</span>'
      : '';
    const readyBadge = (c.brandbook_actualised && !archived)
      ? '<span class="sc-ready">● READY FOR SALE</span>'
      : '';
    return '<a class="sc-card'+(owned?' sc-owned':'')+(archived?' sc-card-archived':'')+'" href="view.html?c='+esc(slug)+'">'
      +'<div class="sc-media">'+vis+'<div class="sc-shade"></div>'
      +'<button type="button" class="sc-fav" data-fav="'+esc(slug)+'" aria-label="Favorite" aria-pressed="false">'
      +'<svg viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg></button>'
      +numBadge
      +readyBadge
      +(owned?'<span class="sc-badge">Owned</span>':'')
      +'</div>'
      +'<div class="sc-body">'
      +'<span class="sc-cat">'+esc(catLabel(c.category))+'</span>'
      +'<h3 class="sc-name">'+esc(c.name||slug)+'</h3>'
      +(c.tagline?'<p class="sc-tagline">'+esc(c.tagline)+'</p>':'')
      +'<div class="sc-meta">'
      +'<span>'+(c.size_m2||'—')+' m²</span>'
      +'<span>'+(c.weeks||'—')+'w</span>'
      +'<span>concept brief</span>'
      +'</div>'
      +scarcityBadge(c)
      +'<div class="sc-bottom">'
      +priceBlock
      +'<span class="sc-open">Open <svg width="14" height="9" viewBox="0 0 14 9" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4.5h11M8 1l4 3.5-4 3.5"/></svg></span>'
      +'</div></div></a>';
  }

  function ownedCard(c, opts){
    opts = opts || {};
    const slug = c.slug || c.concept_slug || '';
    const vis = visual(c);
    const sa = opts.superadmin ? '<div class="sc-sa">'
      +'<a class="sc-sa-btn" href="edit.html?c='+esc(slug)+'" onclick="event.stopPropagation()">Edit</a>'
      +(c.has_brandbook?'<a class="sc-sa-btn sc-sa-ok" href="data/concepts/'+esc(slug)+'/'+esc(slug)+'-brandbook.html" target="_blank" rel="noopener" onclick="event.stopPropagation()">Brandbook</a>':'')
      +'</div>' : '';
    return '<div class="sc-card sc-owned sc-owned-tile" data-href="view.html?c='+esc(slug)+'">'
      +'<div class="sc-media">'+vis+'<div class="sc-shade"></div>'
      +'<span class="sc-badge">Owned</span></div>'
      +'<div class="sc-body">'
      +'<span class="sc-cat">'+esc(catLabel(c.category))+'</span>'
      +'<h3 class="sc-name">'+esc(c.name||slug)+'</h3>'
      +'<div class="sc-meta">'
      +'<span>'+(c.size_m2||'—')+' m²</span>'
      +'<span>'+(c.weeks||'—')+'w</span>'
      +'<span>concept brief</span>'
      +'</div>'
      +'<div class="sc-bottom">'
      +'<span class="sc-open">Open <svg width="14" height="9" viewBox="0 0 14 9" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4.5h11M8 1l4 3.5-4 3.5"/></svg></span>'
      +'</div>'+sa+'</div></div>';
  }

  function favCard(c){
    const slug = c.slug || c.concept_slug || '';
    const vis = visual(c);
    return '<div class="sc-card sc-fav-card" data-href="view.html?c='+esc(slug)+'">'
      +'<div class="sc-media">'+vis+'<div class="sc-shade"></div>'
      +'<button type="button" class="sc-rm" data-fav="'+esc(slug)+'" aria-label="Remove">'
      +'<svg viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg></button>'
      +'</div>'
      +'<div class="sc-body">'
      +'<span class="sc-cat">'+esc(catLabel(c.category))+'</span>'
      +'<h3 class="sc-name">'+esc(c.name||slug)+'</h3>'
      +'<div class="sc-meta">'
      +'<span>€'+(c.price_eur||0)+'</span>'
      +'<span>'+(c.size_m2||'—')+' m²</span>'
      +'<span>'+(c.weeks||'—')+'w</span>'
      +'</div></div></div>';
  }

  function wireClicks(container){
    container.querySelectorAll('.sc-card[data-href]').forEach(function(el){
      el.addEventListener('click', function(e){
        if(e.target.closest('.sc-sa-btn, .sc-fav, .sc-rm')) return;
        location.href = el.dataset.href;
      });
    });
  }

  // Enrich catalog.json with DB flags + scarcity metrics.
  // Reads two anon-safe views: public_verified_catalog (flags + catalog_number + ls_url)
  // and public_concepts_scarcity (copies_left, current_price_eur, archived).
  async function enrichFromDB(catalog, sb){
    if(!sb || !Array.isArray(catalog)) return catalog;
    try{
      const [catRes, scRes] = await Promise.all([
        sb.from('public_verified_catalog').select('slug, has_brandbook, brandbook_actualised, ls_url, catalog_number'),
        sb.from('public_concepts_scarcity').select('*')
      ]);
      const byslug = Object.create(null);
      (catRes.data || []).forEach(function(r){ byslug[r.slug] = r; });
      const scBySlug = Object.create(null);
      (scRes.data || []).forEach(function(r){ scBySlug[r.slug] = r; });
      return catalog.map(function(c){
        const row = byslug[c.slug];
        const sc = scBySlug[c.slug];
        const base = row ? Object.assign({}, c, {
          verified: true,
          has_brandbook: row.has_brandbook,
          brandbook_actualised: row.brandbook_actualised,
          ls_url: row.ls_url,
          catalog_number: row.catalog_number
        }) : c;
        if(!sc) return base;
        return Object.assign({}, base, {
          copies_left: sc.copies_left,
          max_copies: sc.max_copies,
          copies_sold: sc.copies_sold,
          archived: sc.archived,
          current_price_eur: sc.current_price_eur
        });
      });
    }catch(e){ return catalog; }
  }

  // Scarcity badge HTML: "2/5 copies left" with tooltip explaining the rule
  function scarcityBadge(c){
    if(c.archived){
      return '<span class="sc-scarcity sc-archived" title="This concept is sold out and will never be sold again. It is now an exclusive asset of its owners.">◉ Sold out</span>';
    }
    if(typeof c.copies_left !== 'number') return '';
    const left = c.copies_left;
    const cap = c.max_copies || 5;
    const tip = 'Only ' + cap + ' copies of this concept are ever sold. After that, it goes into the permanent archive and is retired forever. The fewer copies remain, the higher the price climbs.';
    const cls = left <= 1 ? 'sc-scarcity sc-last' : (left <= 2 ? 'sc-scarcity sc-hot' : 'sc-scarcity');
    return '<span class="'+cls+'" title="'+esc(tip)+'">◉ '+left+'/'+cap+' copies left</span>';
  }

  return {
    CAT_PAL: CAT_PAL,
    CAT_LABELS: CAT_LABELS,
    isPh: isPh,
    visual: visual,
    catLabel: catLabel,
    shopCard: shopCard,
    ownedCard: ownedCard,
    favCard: favCard,
    wireClicks: wireClicks,
    esc: esc,
    enrichFromDB: enrichFromDB,
    scarcityBadge: scarcityBadge
  };
})();
