// public/service-worker.js
const CACHE = 'labo-v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/','/index.html'])));
});
self.addEventListener('fetch', e => {
  // laisser passer Vite & API
  const url = new URL(e.request.url);
  if (url.port==='3001' && (url.pathname.startsWith('/@')||url.pathname.startsWith('/src'))) return;
  if (url.pathname.startsWith('/api')) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});