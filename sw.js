/* SVITA service worker — minimal offline shell + stale-while-revalidate for catalog */
const VERSION = 'svita-v15-placeholder-contract';
const SHELL = [
  '/',
  '/index.html',
  '/shop.html',
  '/legal.html',
  '/js/svita-card.js',
  '/js/svita-card.css',
  '/js/svita-nav.js',
  '/js/svita-footer.js',
  '/data/catalog.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // third-party -> bypass

  // HTML and JSON: network-first, fall back to cache
  if (req.headers.get('accept')?.includes('text/html') || url.pathname.endsWith('.json')) {
    event.respondWith(
      fetch(req).then((res) => {
        const clone = res.clone();
        caches.open(VERSION).then((c) => c.put(req, clone));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Static assets: cache-first with background refresh
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req).then((res) => {
        if (res.ok) caches.open(VERSION).then((c) => c.put(req, res.clone()));
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
