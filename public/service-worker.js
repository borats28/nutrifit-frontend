const CACHE_NAME = "nutrifit-v1";
const urlsToCache = ["/", "/index.html", "/static/js/bundle.js"];

// eslint-disable-next-line no-restricted-globals
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});