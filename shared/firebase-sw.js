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

// Push quando app está em BACKGROUND ou FECHADO
messaging.onBackgroundMessage(function(payload) {
  console.log('Push background recebido:', payload);

  var n = payload.notification || {};
  var titulo = n.title || 'Alpha Suplementos 💪';
  var corpo  = n.body  || '';
  var dados  = payload.data || {};

  // Ícone e badge
  var opcoes = {
    body: corpo,
    icon: '/alpha-suplementos/shared/logo.png',
    badge: '/alpha-suplementos/shared/logo.png',
    vibrate: [200, 100, 200, 100, 200],
    requireInteraction: true, // mantém na tela até o usuário interagir
    data: dados,
    actions: [
      { action: 'ver', title: '👀 Ver oferta' },
      { action: 'fechar', title: '✕ Fechar' }
    ]
  };

  // Cor de fundo dependendo do tipo
  if(dados.tipo === 'PROMOCAO') {
    opcoes.tag = 'promo-alpha';
    opcoes.renotify = true;
  } else if(dados.tipo === 'REPOSICAO') {
    opcoes.tag = 'reposicao-' + (dados.produtoId || 'produto');
  } else if(dados.tipo === 'COMPRA') {
    opcoes.tag = 'compra-alpha';
  }

  return self.registration.showNotification(titulo, opcoes);
});

// Clique na notificação
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  var url = 'https://sistemaalphasuplementos.github.io/alpha-suplementos/cliente/';

  if(event.action === 'fechar') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // Se o app já está aberto, foca nele
      for(var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if(client.url.includes('/cliente/') && 'focus' in client) {
          return client.focus();
        }
      }
      // Senão abre o app
      if(clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Instalação do service worker
self.addEventListener('install', function(event) {
  console.log('Alpha SW instalado!');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('Alpha SW ativado!');
  event.waitUntil(clients.claim());
});
