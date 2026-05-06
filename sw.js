/* SVITA service worker — network-first for HTML/JS/JSON, cache-first only for binary assets */
const VERSION = 'svita-v18-network-first';
const SHELL = [
  '/',
  '/index.html',
  '/shop.html',
  '/legal.html',
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
  if (url.origin !== location.origin) return;

  const isHTML = req.headers.get('accept')?.includes('text/html');
  const ext = url.pathname.split('.').pop().toLowerCase();
  const codeLike = ['js','css','json','html','svg'].includes(ext);

  // Code-like assets: network-first so deploys propagate without stale cache.
  if (isHTML || codeLike) {
    event.respondWith(
      fetch(req).then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(VERSION).then((c) => c.put(req, clone));
        }
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Binary assets (images, fonts, PDFs): cache-first with background refresh.
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
