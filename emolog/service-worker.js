// Cache version - increment when updating cache strategy
const CACHE_VERSION = 'v1';
const CACHE_NAME = `emolog-${CACHE_VERSION}`;
const RUNTIME_CACHE = `emolog-runtime-${CACHE_VERSION}`;

// All critical files that must be cached for offline functionality
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/app.js',
  '/src/models/emotions.js',
  '/src/models/Entry.js',
  '/src/screens/EntryScreen.js',
  '/src/screens/HistoryScreen.js',
  '/src/storage/localStorage.js'
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  const msg = 'SW: Installing...';
  console.log(msg);
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log('SW: Opening cache:', CACHE_NAME);
        
        // Cache each file individually to handle failures gracefully
        for (const asset of CRITICAL_ASSETS) {
          try {
            const response = await fetch(asset);
            if (response && response.status === 200) {
              await cache.put(asset, response);
              console.log('SW: ✓ Cached:', asset);
            } else {
              console.warn('SW: ! Bad status for', asset, response.status);
            }
          } catch (err) {
            console.error('SW: ✗ Failed to cache ' + asset + ':', err.message);
          }
        }
        console.log('SW: Install complete');
      } catch (err) {
        console.error('SW: Cache install error:', err);
      }
    })()
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old cache versions
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache with smart fallback for offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);
  const isNavigation = request.mode === 'navigate';

  // For navigation requests (HTML pages), try cache first, then network
  if (isNavigation) {
    event.respondWith(
      (async () => {
        try {
          console.log('SW: [NAVIGATE] Trying network:', request.url);
          // Try to fetch from network first
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            console.log('SW: [NAVIGATE] Network success, caching');
            // Cache successful responses
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          console.log('SW: [NAVIGATE] Network failed:', err.message);
          // Network failed, try cache
          let cachedResponse = await caches.match(request);
          if (!cachedResponse) {
            console.log('SW: [NAVIGATE] Not in cache, trying index.html');
            // Not found in cache, serve index.html as fallback
            cachedResponse = await caches.match('/index.html');
          }
          if (cachedResponse) {
            console.log('SW: [NAVIGATE] Serving from cache');
            return cachedResponse;
          }
          console.error('SW: [NAVIGATE] No cache available!');
          return new Response('Offline - App not cached', { status: 503 });
        }
      })()
    );
    return;
  }

  // For JavaScript, CSS, and other assets, use cache-first strategy
  // This ensures fast load and offline functionality
  event.respondWith(
    (async () => {
      try {
        // Try cache first (fastest for offline)
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          console.log('SW: [ASSET] Cache hit:', url.pathname);
          return cachedResponse;
        }

        console.log('SW: [ASSET] Not cached, fetching:', url.pathname);
        // Not in cache, fetch from network
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
          console.log('SW: [ASSET] Network success, caching');
          // Cache successful responses for future use
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch (err) {
        console.warn('SW: [ASSET] Network failed:', url.pathname, err.message);
        // Return cached version if available, otherwise offline response
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          console.log('SW: [ASSET] Serving cached fallback:', url.pathname);
          return cachedResponse;
        }
        // Last resort: return a generic offline response
        console.error('SW: [ASSET] No cache for:', url.pathname);
        return new Response('Resource not available offline', { status: 503 });
      }
    })()
  );
});
