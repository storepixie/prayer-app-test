// VERSION: 36
const pb_cache = "pbc_v1_" + new Date().toISOString().split('T')[0]; // Using the date in YYYY-MM-DD format
const assets = [
    "./manifest.json",
    "./index.html",
    "./offline.html",
    "./prayers.html",
    "./way-of-cross.html",
    "./holymass.html",
    "./family-prayers.html",
    "./transliteration.html",
    "./children-mass.html",
    "./st-alphonsa-novena.html",
    "./holyweek.html",
    "./palm-sunday.html",
    "./maundy-thursday.html",
    "./good-friday.html",
    "./holy-saturday.html",
    "./templates/childrens-mass.html",
    "./templates/family-prayers.html",
    "./templates/holymass-transliteration.html",
    "./templates/st-alphonsa-novena.html",
    "./templates/way-of-cross.html",
    "./templates/palm-sunday.html",
    "./templates/maundy-thursday.html",
    "./templates/good-friday.html",
    "./templates/holy-saturday.html",
    "./fonts/Gayathri-Regular.woff2",
    "./fonts/Gayathri-Regular.otf",
    "./fonts/Gayathri-Regular.ttf",
    "./fonts/Roboto-Light.ttf",
    "./fonts/Roboto-Medium.ttf",
    "./fonts/Roboto-MediumItalic.ttf",
    "./fonts/Roboto-Regular.ttf",
    "./fonts/Roboto-Bold.ttf",
    "./css/styles.css",
    "./css/mass.css",
    "./css/prayers.css",
    "./js/app.js",
    "./js/menu.js",
    "./js/client.js",
    "./android-icon-144x144.png",
    "./android-icon-192x192.png",
    "./android-icon-36x36.png",
    "./android-icon-48x48.png",
    "./android-icon-72x72.png",
    "./android-icon-96x96.png",
    "./apple-icon-120x120.png",
    "./apple-icon-144x144.png",
    "./apple-icon-114x114.png",
    "./apple-icon-152x152.png",
    "./apple-icon-180x180.png",
    "./apple-icon-57x57.png",
    "./apple-icon-60x60.png",
    "./apple-icon-72x72.png",
    "./apple-icon-76x76.png",
    "./apple-icon-precomposed.png",
    "./apple-icon.png",
    "./favicon-16x16.png",
    "./favicon-32x32.png",
    "./favicon.ico",
    "./ms-icon-144x144.png",
    "./ms-icon-150x150.png",
    "./ms-icon-310x310.png",
    "./ms-icon-70x70.png",
    "./images/jesus-128.png",
    "./images/jesus-256.png",
    "./images/jesus-64.png",
    "./images/jesus.png",
    "./images/logo.png",
    "./images/holy-family.jpg",
    "./images/st-alphonsa.jpg",
    "./images/menu-cover.jpg",
    "./images/marthoma-cross.jpg",
    "./images/way-of-the-cross.png",
    "./images/hosanna.jpg",
    "./images/last-supper.jpeg",
    "./images/good-friday.jpg",
    "./images/holy-saturday.jpg",
]

self.addEventListener('install', (event) => {
  self.skipWaiting();  // Force the new SW to activate immediately

  const cacheBypassRequests = assets.map(
    (url) => new Request(url, { cache: 'reload' })
  );

  event.waitUntil(
    caches.open(pb_cache)
      .then((cache) => {
        return cache.addAll(cacheBypassRequests)
          .then(() => {
            return self.skipWaiting();  // Force new SW to activate
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [pb_cache];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);  // Clean up old caches
          }
        })
      );
    }).then(() => {
      // Notify clients about the new version
      self.clients.matchAll().then(function(clients) {
        clients.forEach(function(client) {
          client.postMessage({ action: "newVersionAvailable" });
        });
      });
    })
  );
});

// Fetch event to serve the cached content or fallback to offline page if needed
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response; // Return from cache if found
      }

      // If the request is not found in cache, try to fetch it from the network
      return fetch(event.request).then(function(networkResponse) {
        if (networkResponse.status === 404) {
          return caches.match('/offline.html'); // Show offline page if not found
        }

        // Otherwise, cache the new resource
        return caches.open(pb_cache).then(function(cache) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(function() {
        // If both cache and network fail (offline), return the offline page
        return caches.match('/offline.html');
      });
    })
  );
});

self.addEventListener('install', (event) => {
  self.skipWaiting();  // Force waiting service worker to become active
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Notify clients about the new version
    self.clients.claim()  // Claims control of all clients immediately
  );
});

// self.addEventListener('message', function (event) {
//   if (event.data && event.data.action === 'checkForUpdates') {
//     // Here, you can send a message to the clients if a new version is available.
//     event.ports[0].postMessage({ action: 'newVersionAvailable' });
//   }
// });

self.addEventListener('updatefound', (event) => {
  const installingWorker = event.target;
  installingWorker.onstatechange = () => {
    if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
      // Send a message to notify that new content is available
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ action: "newVersionAvailable" });
        });
      });
    }
  };
});
