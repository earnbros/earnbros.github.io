'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "index.html": "fa8ff7d74e926bfc787ebbf45b5db463",
"/": "fa8ff7d74e926bfc787ebbf45b5db463",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/images/stocktwits_full_logo.png": "b76d479cc5bb7f247ce69e45647d82a9",
"assets/images/market_chameleon_full_logo.png": "b7e4661eaf4e294a6355697fe7a09607",
"assets/images/stocktwits_logo.png": "f4ed313c043609e1778056d6dd648767",
"assets/images/stockcharts_logo.png": "610144354ac9963892ae5346619b3b6a",
"assets/images/yahoo_finance_logo.png": "3765a212363e5d353b4c62e12ffebcaa",
"assets/images/seeking_alpha_logo.png": "81e1747d798f161d387457e95e4dc2af",
"assets/images/market_chameleon_logo.png": "f7ddfe8fe791c31f192c1eaa005cc741",
"assets/images/trading_view_logo.png": "36c6099fece12338517f2af35ef87bac",
"assets/images/zacks_logo.png": "8c0255319b351dae64b6d8da575af3e2",
"assets/images/td_ameritrade_logo.png": "ba97bfc06cdf1422ba2928952e635ac7",
"assets/images/market_watch_logo.png": "5fcb0bd2f03b85e17c36527897bb78e2",
"assets/images/fintel_logo.png": "ec0f1e421adc58e872127d238ade692f",
"assets/images/robinhood_logo.png": "3973f862025fa474f76773798390adca",
"assets/images/wsj_logo.png": "e5035ee03e5bc1989c7d1580f882e9ca",
"assets/images/seeking_alpha_full_logo.png": "1166971ebc9f818ccc4502b9b9eb8ca7",
"assets/images/fintel_full_logo.png": "fedba21aefce96b7395a7c2ad6436880",
"assets/images/google_news_logo.png": "b38781da6392997b866029b62985a050",
"assets/images/finviz_full_logo.png": "ffe028c1c71003ad3935324ef89f4519",
"assets/images/finviz_logo.png": "e34fd51130a2970961a6a64157f7d8ac",
"assets/images/logo_bros.png": "a4959a69b8b6966604b48b6374eff4e0",
"assets/images/google_finance_logo.png": "f099d0676b056942b0240a2eb1c07c59",
"assets/images/similar_web_logo.png": "0d5a24165cd41fbfdff01b0bf9e0f3c0",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"assets/FontManifest.json": "01700ba55b08a6141f33e168c4a6c22f",
"assets/AssetManifest.json": "30b29567d05016bcbee118723275e5bb",
"assets/NOTICES": "7e5d662529d5d1f4683f3d31f5f35591",
"arc-sw.js": "1157b02ca30f04f3b201e59c76ab3096",
"favicon.ico": "43d9fcbd22a46dcb808a5787e4b9951b",
"main.dart.js": "93510b1551afeecfc6eca101632781d6",
"manifest.json": "9eeac789dae8289e100efea123cf19de",
"icons/favicon-32x32.png": "21210eb786e533a08e38f2978b253cde",
"icons/apple-icon-180x180.png": "0f508471fdca3f1e0fac038e6d94b52d",
"icons/favicon-16x16.png": "c4deeb37eeed133cf7cea77e5058771e"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/LICENSE",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      // Provide a no-cache param to ensure the latest version is downloaded.
      return cache.addAll(CORE.map((value) => new Request(value, {'cache': 'no-cache'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');

      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }

      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#')) {
    key = '/';
  }
  // If the URL is not the the RESOURCE list, skip the cache.
  if (!RESOURCES[key]) {
    return event.respondWith(fetch(event.request));
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache. Ensure the resources are not cached
        // by the browser for longer than the service worker expects.
        var modifiedRequest = new Request(event.request, {'cache': 'no-cache'});
        return response || fetch(modifiedRequest).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.message == 'skipWaiting') {
    return self.skipWaiting();
  }

  if (event.message = 'downloadOffline') {
    downloadOffline();
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.add(resourceKey);
    }
  }
  return Cache.addAll(resources);
}
