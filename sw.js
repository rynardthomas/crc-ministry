/* Keeps the launcher itself (this page + icons) on the phone so it opens instantly, even before the app loads. */
var CACHE = 'crc-launcher-v3';
/* notifications: Firebase shows them when the app is closed, and opens the app when one is tapped */
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js', 'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
firebase.initializeApp({ apiKey: 'AIzaSyBObfXE0uaPMeOuN001X12g6JQaHkwIo5w', authDomain: 'crc-ministry-app.firebaseapp.com', projectId: 'crc-ministry-app', storageBucket: 'crc-ministry-app.firebasestorage.app', messagingSenderId: '717290466939', appId: '1:717290466939:web:a492528dbc1b9376afbcde' });
firebase.messaging();
var FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;   // the app itself always comes fresh from Google
  e.respondWith(fetch(e.request).then(function (r) {
    var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); return r;
  }).catch(function () { return caches.match(e.request).then(function (r) { return r || caches.match('index.html'); }); }));
});
