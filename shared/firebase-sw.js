importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBUZaER1-J4-sui90-lHW56P7JTBvfAQHE",
  authDomain: "sistema-alpha-b12d0.firebaseapp.com",
  projectId: "sistema-alpha-b12d0",
  storageBucket: "sistema-alpha-b12d0.firebasestorage.app",
  messagingSenderId: "714388410138",
  appId: "1:714388410138:web:c42c2391931d25acc0e6a3",
  databaseURL: "https://sistema-alpha-b12d0-default-rtdb.firebaseio.com"
});

const messaging = firebase.messaging();

// Receber push quando app estiver em background
messaging.onBackgroundMessage(function(payload) {
  console.log('Push em background:', payload);
  const n = payload.notification || {};
  self.registration.showNotification(n.title || 'Alpha Suplementos', {
    body: n.body || '',
    icon: '/shared/logo.png',
    badge: '/shared/logo.png',
    vibrate: [200, 100, 200],
    data: payload.data || {}
  });
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('https://sistemaalphasuplementos.github.io/alpha-suplementos/cliente/'));
});
