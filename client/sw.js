const CACHE_NAME = 'example-spa-cache-v1.0';

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([
      './',
      'index.html',
      'index.js',
      'style.css',
      './screens/about.inc',
      './screens/contact.inc',
      './screens/error.inc',
      './screens/foods.inc',
      './screens/home.inc',
      './screens/login.inc',
      './screens/logout.inc',
    ]);
  })());
});

self.addEventListener('fetch', event => {
  // TODO handle POSTS!!
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    }),
  );
});
