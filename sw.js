/* Do It — Service Worker v3 PUSH ONLY (no caching) */
/* Every page load hits the network = always latest version */

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));

/* Push notification handler */
self.addEventListener('push', e => {
  let data = { title: 'Do It', body: 'Your tasks are waiting.' };
  try { data = e.data.json(); } catch (_) {}
  e.waitUntil(
    self.registration.showNotification(data.title || 'Do It', {
      body: data.body || 'Time to get it done.',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'doit',
      renotify: true,
      data: { url: '/' }
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const open = list.find(c => c.url.includes(self.registration.scope));
      return open ? open.focus() : clients.openWindow('/');
    })
  );
});
