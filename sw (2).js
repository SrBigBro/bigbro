// BIG BRO · Service Worker
const CACHE = 'bigbro-v2';
const ASSETS = ['/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // Never intercept auth, Supabase, external APIs
  if (url.includes('supabase.co')) return;
  if (url.includes('googleapis.com')) return;
  if (url.includes('umap.openstreetmap')) return;
  if (url.includes('script.google.com')) return;
  if (url.includes('rss2json.com')) return;
  if (url.includes('mymemory.translated')) return;
  // Only cache same-origin static assets
  if (!url.startsWith(self.location.origin)) return;
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
