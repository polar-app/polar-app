
// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
    'index.html',
    './', // Alias for index.html
    'styles.css',
    '../../styles/main.css',
    'demo.js'
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
    // event.waitUntil(
    //     caches.open(PRECACHE)
    //           .then(cache => cache.addAll(PRECACHE_URLS))
    //           .then(self.skipWaiting())
    // );
    console.log("Installed");
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
    // const currentCaches = [PRECACHE, RUNTIME];
    // event.waitUntil(
    //     caches.keys().then(cacheNames => {
    //         return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    //     }).then(cachesToDelete => {
    //         return Promise.all(cachesToDelete.map(cacheToDelete => {
    //             return caches.delete(cacheToDelete);
    //         }));
    //     }).then(() => self.clients.claim())
    // );
    console.log("Activated");
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {

    let url = event.request.url;

    console.log(`FIXME1: ${url}`);

    if(isCacheable(url)) {

        caches.match(event.request).then(cachedResponse => {

            console.log("FIXME2");

            if (cachedResponse) {
                console.log("FIXME3");
                return cachedResponse;
            }

            return caches.open(RUNTIME).then(cache => {
                return fetch(event.request).then(response => {
                    console.log(`Putting data into cache for: ${url}`, response);
                    // Put a copy of the response in the runtime cache.
                    return cache.put(event.request, response.clone()).then(() => {
                        console.log("Returning response: ", response);
                        return response;
                    });

                });
            });

        })

    } else {
        console.warn("Unable to cache request for URL: " + event.request.url);
    }

    // // Skip cross-origin requests, like those for Google Analytics.
    // if (event.request.url.startsWith(self.location.origin)) {
    //     event.respondWith(

    //     );
    // }

});

function isCacheable(url) {
    return url.startsWith("http:") || url.startsWith("https:");
}
