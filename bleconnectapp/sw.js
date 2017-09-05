/* sw.js */
importScripts('serviceworker-cache-polyfill.js');
var version="0.1";
var CACHE_NAME = 'bleconnection-demo-'+version;
var urlsToCache = [
    './index.html',
    './manifest.json',
    './register_sw.js',
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                //console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    //console.log("[return cache] ", (response.url).split("/").pop());
                    return response;
                }
                var fetchRequest = event.request.clone();

                return fetch(fetchRequest)
                    .then(function(response) {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    });
            })
    );
});
