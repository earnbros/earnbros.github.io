'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "index.html": "ebe9fa9ec1147b9a0ae9e898c80bba57",
"/": "ebe9fa9ec1147b9a0ae9e898c80bba57",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/LICENSE": "2838286d322aa7910034b3cc7c1cff20",
"assets/images/logo_bros.png": "a4959a69b8b6966604b48b6374eff4e0",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"assets/FontManifest.json": "01700ba55b08a6141f33e168c4a6c22f",
"assets/AssetManifest.json": "491ee23db17a2745c0a9fc7802758573",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"main.dart.js": "276f31aaadb70d2637e6b04983fd1ca9",
"manifest.json": "2bbc35fc99c905c33c5207c2ed41ed76",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1"
};

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheName) {
      return caches.delete(cacheName);
    }).then(function (_) {
      return caches.open(CACHE_NAME);
    }).then(function (cache) {
      return cache.addAll(Object.keys(RESOURCES));
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
