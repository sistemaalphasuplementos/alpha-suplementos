/**
 * ALPHA SUPLEMENTOS — Service Worker simplificado
 * Compatível com iOS Safari PWA
 */
self.addEventListener('install', function(e){
  self.skipWaiting();
});
self.addEventListener('activate', function(e){
  e.waitUntil(self.clients.claim());
});
self.addEventListener('push', function(e){
  if(!e.data) return;
  var data;
  try{ data = e.data.json(); }
  catch(_){ data = { titulo:'Alpha Suplementos', corpo: e.data.text() }; }
  e.waitUntil(
    self.registration.showNotification(data.titulo||'Alpha Suplementos',{
      body:  data.corpo||'',
      icon:  'https://sistemaalphasuplementos.github.io/alpha-suplementos/shared/logo.png',
      badge: 'https://sistemaalphasuplementos.github.io/alpha-suplementos/shared/logo.png',
      data:  { url: data.url||'https://sistemaalphasuplementos.github.io/alpha-suplementos/cliente/' }
    })
  );
});
self.addEventListener('notificationclick', function(e){
  e.notification.close();
  var url = (e.notification.data&&e.notification.data.url)||'https://sistemaalphasuplementos.github.io/alpha-suplementos/cliente/';
  e.waitUntil(clients.openWindow(url));
});
self.addEventListener('fetch', function(e){});
