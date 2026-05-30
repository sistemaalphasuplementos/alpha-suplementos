/**
 * ALPHA SUPLEMENTOS — Service Worker v70
 * Push notifications + Background sync + Precache de assets
 *
 * DEPLOY: substituir firebase-sw.js na pasta shared/
 * Versão: v70
 */

const SW_VERSION   = 'alpha-v70';
const CACHE_STATIC = SW_VERSION + '-static';
const CACHE_API    = SW_VERSION + '-api';

// Assets que sempre devem estar disponíveis offline
const PRECACHE_ASSETS = [
  '/alpha-suplementos/cliente/',
  '/alpha-suplementos/cliente/index.html',
  '/alpha-suplementos/shared/logo.png',
  '/alpha-suplementos/shared/manifest.json',
  // Adicione aqui outros assets estáticos (CSS, ícones, fontes)
];

// ─── Instalação ────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW v70] Instalando...');
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        // Não falha a instalação por assets ausentes
        console.warn('[SW v70] Alguns assets não cacheados:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ─── Ativação ──────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW v70] Ativando...');
  event.waitUntil(
    caches.keys().then((chaves) => {
      return Promise.all(
        chaves
          .filter(c => c !== CACHE_STATIC && c !== CACHE_API)
          .map(c => {
            console.log('[SW v70] Removendo cache antigo:', c);
            return caches.delete(c);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ─── Fetch: Estratégia por tipo de recurso ─────────────────────────────────
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // GAS API: Network First (sem cache — dados ao vivo)
  if (url.hostname === 'script.google.com') {
    event.respondWith(fetch(event.request).catch(() => {
      return new Response(JSON.stringify({ erro: 'offline', cached: false }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }));
    return;
  }

  // Firebase: Network First com fallback local
  if (url.hostname.includes('firebaseio.com')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response('null', { headers: { 'Content-Type': 'application/json' } });
      })
    );
    return;
  }

  // Assets estáticos: Cache First
  if (
    event.request.destination === 'image' ||
    event.request.destination === 'font'  ||
    event.request.url.match(/\.(png|jpg|svg|woff2?|ico)$/)
  ) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request).then(res => {
          const clone = res.clone();
          caches.open(CACHE_STATIC).then(c => c.put(event.request, clone));
          return res;
        });
      })
    );
    return;
  }

  // HTML/JS/CSS: Stale While Revalidate
  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE_STATIC).then(c => c.put(event.request, clone));
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});

// ─── Background Sync ───────────────────────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'alpha-sync-queue') {
    console.log('[SW v70] Background sync disparado');
    event.waitUntil(
      // Notifica o cliente para processar a fila
      self.clients.matchAll({ type: 'window' }).then(clients => {
        clients.forEach(client => {
          client.postMessage({ tipo: 'PROCESSAR_FILA' });
        });
      })
    );
  }
});

// ─── Push Notifications ────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { titulo: 'Alpha Suplementos', corpo: event.data.text() };
  }

  const {
    titulo    = 'Alpha Suplementos 💪',
    corpo     = 'Você tem uma novidade!',
    icone     = '/alpha-suplementos/shared/logo.png',
    badge     = '/alpha-suplementos/shared/logo.png',
    url       = '/alpha-suplementos/cliente/',
    tag       = 'alpha-geral',
    tipo      = 'geral'
  } = payload;

  // Personalização por tipo
  const opcoesPorTipo = {
    treino_ausente: {
      actions: [
        { action: 'registrar', title: '💪 Registrar treino' },
        { action: 'dispensar', title: 'Mais tarde' }
      ]
    },
    novo_pr: {
      actions: [
        { action: 'ver', title: '🏆 Ver meu PR' }
      ]
    },
    voucher: {
      requireInteraction: true,
      actions: [
        { action: 'resgatar', title: '🎁 Resgatar voucher' }
      ]
    },
    streak_risco: {
      actions: [
        { action: 'registrar', title: '🔥 Manter streak' }
      ]
    }
  };

  const opcoesExtra = opcoesPorTipo[tipo] || {};

  const opcoes = {
    body: corpo,
    icon: icone,
    badge,
    tag,
    data: { url, tipo, timestamp: Date.now() },
    vibrate: [200, 100, 200],
    ...opcoesExtra
  };

  event.waitUntil(
    self.registration.showNotification(titulo, opcoes)
  );
});

// ─── Clique em notificação ─────────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const { url, tipo } = event.notification.data || {};
  const acao = event.action;

  // Mapeamento de ações específicas
  const destinos = {
    registrar : '/alpha-suplementos/cliente/#treino',
    resgatar  : '/alpha-suplementos/cliente/#premios',
    ver       : '/alpha-suplementos/cliente/#ranking',
  };

  const destino = destinos[acao] || url || '/alpha-suplementos/cliente/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      // Se já tem uma aba aberta, foca e navega
      for (const client of clients) {
        if (client.url.includes('/alpha-suplementos/') && 'focus' in client) {
          client.focus();
          client.postMessage({ tipo: 'NAVEGAR', destino });
          return;
        }
      }
      // Se não tem aba aberta, abre
      return self.clients.openWindow(destino);
    })
  );
});

// ─── Mensagens do cliente ──────────────────────────────────────────────────
self.addEventListener('message', (event) => {
  const { tipo, dados } = event.data || {};

  if (tipo === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (tipo === 'REGISTRAR_SYNC') {
    // Registra background sync para quando voltar online
    self.registration.sync?.register('alpha-sync-queue');
  }

  if (tipo === 'LIMPAR_CACHE') {
    caches.keys().then(chaves => chaves.forEach(c => caches.delete(c)));
  }
});
