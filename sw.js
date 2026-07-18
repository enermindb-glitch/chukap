/* ==========================================================
   sw.js — service worker for the Chuka Premier League PWA.
   Caches the app shell so the site can install and reopen
   offline; falls through to the network for everything else
   (so live Google Sheets data still stays fresh).
   ========================================================== */

const CPL_CACHE = 'cpl-shell-v1';

// Bump CPL_CACHE (e.g. -> 'cpl-shell-v2') whenever you change
// any of these files so returning visitors get the update.
const SHELL_FILES = [
  'index.html',
  'league-a.html',
  'league-b.html',
  'players.html',
  'referees.html',
  'news.html',
  'gallery.html',
  'equipment.html',
  'transfers.html',
  'register.html',
  'enquiries.html',
  'about.html',
  'login.html',
  'styles.css',
  'data.js',
  'layout.js',
  'manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CPL_CACHE).then((cache) => {
      // cache files individually so one missing/renamed page
      // doesn't fail the whole install
      return Promise.all(
        SHELL_FILES.map((file) =>
          cache.add(file).catch((err) => console.warn('SW: skip', file, err))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CPL_CACHE).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Let live data (Google Sheets / apps-script calls, or any
  // other-origin request) always go to the network as normal.
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CPL_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached); // offline: fall back to cache

      // cache-first for instant loads, but refresh cache in background
      return cached || network;
    })
  );
});
