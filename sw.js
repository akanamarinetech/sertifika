// AKANA Üretim – uygulama (PWA) servis çalışanı
// Kural: sayfalar HER ZAMAN önce internetten alınır (yeni yüklenen sürüm hemen gelir).
// İnternet yoksa son açılan hali gösterilir. Apps Script (kayıt sunucusu) isteklerine dokunulmaz.
const ON = 'akana-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== ON).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== self.location.origin) return;   // sunucu istekleri ve dış adresler: dokunma
  e.respondWith(
    fetch(r).then(res => {
      if (res.ok) { const kopya = res.clone(); caches.open(ON).then(c => c.put(r, kopya)); }
      return res;
    }).catch(() => caches.match(r, { ignoreSearch: true }).then(m => m || caches.match('index.html')))
  );
});
