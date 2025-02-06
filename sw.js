// Cache name
var cacheName = 'secondVersion';
// const pb_cache = "pbc_v1_" + new Date().toISOString().split('T')[0];

// List of assets to cache
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
];

// Install event to cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(assets))
      .then(() => {
        self.skipWaiting();
      })
  );
});

// Message event to skip waiting
self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Fetch event to serve cached content or fetch from the network
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response; // Return from cache if found
        }
        // Otherwise, fetch the resource from the network
        return fetch(event.request)
          .then(function (networkResponse) {
            if (networkResponse.status === 404) {
              return caches.match('/offline.html'); // Fallback if not found
            }
            return caches.open(cacheName).then(function (cache) {
              cache.put(event.request, networkResponse.clone()); // Cache the new response
              return networkResponse;
            });
          })
          .catch(function () {
            return caches.match('/offline.html'); // Fallback for offline
          });
      })
  );
});