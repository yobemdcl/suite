/* eslint-disable no-restricted-globals */
const CACHE_NAME = "yobe-mining-pwa-v8";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./app.js",
  "./offline.html",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./assets/Logo.jpeg",
  "./assets/dashboard-bg.jpg",
];

function shouldCacheRequest(requestUrl) {
  // Only cache same-origin http(s) resources. Cross-origin and non-http(s) cause
  // subtle issues (e.g., blob: URLs and opaque/cors mode mismatches) especially
  // with html2canvas downloads and external QR/image hosts.
  if (requestUrl.protocol !== "http:" && requestUrl.protocol !== "https:") return false;
  if (requestUrl.origin !== self.location.origin) return false;

  // Avoid caching tile servers or other large, high-churn resources.
  const host = requestUrl.hostname;
  if (
    host.includes("tile.openstreetmap.org") ||
    host.includes("a.tile.openstreetmap.org") ||
    host.includes("b.tile.openstreetmap.org") ||
    host.includes("c.tile.openstreetmap.org")
  ) {
    return false;
  }
  // Avoid caching Google Apps Script responses (POST is already excluded elsewhere).
  if (host.includes("script.google.com")) return false;
  return true;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(
        CORE_ASSETS.map((u) => new Request(u, { cache: "reload" }))
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => (key === CACHE_NAME ? Promise.resolve() : caches.delete(key)))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Never intercept non-http(s) requests (blob:, data:, etc).
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  // Never intercept cross-origin resources.
  if (url.origin !== self.location.origin) return;

  if (!shouldCacheRequest(url)) return;

  // Navigation: serve the app shell offline.
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put(new Request("./index.html"), fresh.clone());
          return fresh;
        } catch (e) {
          const cache = await caches.open(CACHE_NAME);
          return (
            (await cache.match("./index.html")) || (await cache.match("./offline.html"))
          );
        }
      })()
    );
    return;
  }

  // App shell assets that must stay fresh (avoid stale mineral rates and logic).
  const path = url.pathname || "";
  const isAppShellScript =
    path.endsWith("/app.js") ||
    path.endsWith("/index.html") ||
    path.endsWith("/service-worker.js");

  if (isAppShellScript) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        try {
          const fresh = await fetch(req);
          cache.put(req, fresh.clone());
          return fresh;
        } catch (e) {
          return (await cache.match(req)) || (await cache.match("./index.html"));
        }
      })()
    );
    return;
  }

  // Other assets: cache-first with background refresh.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      if (cached) {
        event.waitUntil(
          (async () => {
            try {
              const fresh = await fetch(req);
              cache.put(req, fresh.clone());
            } catch (e) {}
          })()
        );
        return cached;
      }

      try {
        const fresh = await fetch(req);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (e) {
        // If the request is for an image/script and we're offline, there's no safe fallback.
        return cached || (await cache.match("./offline.html"));
      }
    })()
  );
});
