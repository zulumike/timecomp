const CACHE_NAME = "elektro-v1";

const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/index.js',
    '/functions.js',
    '/manifest.json',

    '/admin/index.html',
    '/admin/admin.js',

    '/assets/icon-192.png',
    '/assets/icon-512.png',

    '/assets/Logo_gr_lys.png',
    '/assets/Logo_gr_mork.png',
    '/assets/Logo_gr_svart.png',

    '/assets/Logo_lys.png',
    '/assets/Logo_mork.png',
    '/assets/Logo_svart.png'
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});