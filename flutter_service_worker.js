'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "index.html": "246839d9157a8506d35fe5a3eb1385dc",
"/": "246839d9157a8506d35fe5a3eb1385dc",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/LICENSE": "ed0fee828d37874b38fbe70416fe29e9",
"assets/images/logo_bros.png": "a4959a69b8b6966604b48b6374eff4e0",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"assets/FontManifest.json": "01700ba55b08a6141f33e168c4a6c22f",
"assets/AssetManifest.json": "491ee23db17a2745c0a9fc7802758573",
"favicon.ico": "43d9fcbd22a46dcb808a5787e4b9951b",
"main.dart.js": "ef2bf71a1d34ae3d446d217aa45f821d",
"manifest.json": "2bbc35fc99c905c33c5207c2ed41ed76",
"icons/favicon-32x32.png": "21210eb786e533a08e38f2978b253cde",
"icons/apple-icon-180x180.png": "0f508471fdca3f1e0fac038e6d94b52d",
"icons/favicon-16x16.png": "c4deeb37eeed133cf7cea77e5058771e"
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
