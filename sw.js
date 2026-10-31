/* =========================================================================
   Service worker — offline shell + cache runtime
   Hangger Sukma Prima Darsono — Portfolio

   Naikkan CACHE_VERSION setiap kali aset inti berubah, agar cache lama dibuang.
   ========================================================================= */

var CACHE_VERSION = "hsp-v2";

var APP_SHELL = [
  "./",
  "./index.html",
  "./assets/css/tailwind.css",
  "./assets/css/styles.css",
  "./assets/js/data.js",
  "./assets/js/main.js",
  "./manifest.webmanifest",
  "./assets/img/favicon.svg",
];

/* Install: simpan shell. Tiap aset dicoba sendiri-sendiri agar satu kegagalan
   (mis. gambar belum ada) tidak membatalkan seluruh instalasi. */
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then(function (cache) {
        return Promise.all(
          APP_SHELL.map(function (url) {
            return cache.add(new Request(url, { cache: "reload" })).catch(function () {
              return null;
            });
          })
        );
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

/* Activate: hapus cache versi lama. */
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return key !== CACHE_VERSION;
            })
            .map(function (key) {
              return caches.delete(key);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

/* Fetch. */
self.addEventListener("fetch", function (event) {
  var request = event.request;

  if (request.method !== "GET") return;

  var url = new URL(request.url);

  // Navigasi: network-first, fallback ke shell offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          var copy = response.clone();
          caches.open(CACHE_VERSION).then(function (cache) {
            cache.put("./index.html", copy);
          });
          return response;
        })
        .catch(function () {
          return caches.match("./index.html");
        })
    );
    return;
  }

  // Cross-origin (Tailwind CDN, Google Fonts): cache oportunistik.
  if (url.origin !== self.location.origin) {
    event.respondWith(
      caches.match(request).then(function (cached) {
        if (cached) return cached;
        return fetch(request)
          .then(function (response) {
            var copy = response.clone();
            caches.open(CACHE_VERSION).then(function (cache) {
              cache.put(request, copy);
            });
            return response;
          })
          .catch(function () {
            return cached;
          });
      })
    );
    return;
  }

  // Same-origin: stale-while-revalidate.
  event.respondWith(
    caches.match(request).then(function (cached) {
      var network = fetch(request)
        .then(function (response) {
          if (response && response.status === 200 && response.type === "basic") {
            var copy = response.clone();
            caches.open(CACHE_VERSION).then(function (cache) {
              cache.put(request, copy);
            });
          }
          return response;
        })
        .catch(function () {
          return cached;
        });

      return cached || network;
    })
  );
});
