var LIBRARY = "https://script.google.com/macros/s/AKfycbyEnGEc4_ZLcmPRcjnEy0urL27LEYUdY3t4J0QbQ-nv-LseBuEVh3DNGY6VPphKtRz6/exec";

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) { return caches.delete(key); }));
    }).then(function () {
      return self.clients.claim();
    }).then(function () {
      return new Promise(function (resolve) { setTimeout(resolve, 1000); });
    }).then(function () {
      return self.clients.matchAll({ type: "window", includeUncontrolled: true });
    }).then(function (clients) {
      return Promise.all(clients.map(function (client) {
        var url;
        try { url = new URL(client.url); } catch (e) { return; }
        if (client.url.indexOf(self.registration.scope) !== 0) return;
        if (url.searchParams.has("nileRedirect") || typeof client.navigate !== "function") return;
        url.searchParams.set("nileRedirect", "1");
        return client.navigate(url.href).catch(function () {});
      }));
    })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.mode !== "navigate" || event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request.url, { cache: "reload", credentials: "same-origin", redirect: "follow" }).catch(function () {
      return Response.redirect(LIBRARY, 302);
    })
  );
});
