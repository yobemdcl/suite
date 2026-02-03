# Yobe Mining PWA

This folder is a **mobile-first installable web app (PWA)**.

## Run locally

From this directory:

- `python3 -m http.server 8080`
- Open `http://localhost:8080` in your browser.

## Install on a phone

PWAs require **HTTPS** (or `localhost`) for install/offline features.

- **Android (Chrome):** open the site → menu → **Install app**
- **iPhone/iPad (Safari):** open the site → Share → **Add to Home Screen**

## Files

- `index.html` – app shell + PWA meta tags
- `app.js` – application logic/UI
- `manifest.webmanifest` – install metadata
- `service-worker.js` – offline caching + app shell fallback
- `offline.html` – offline fallback screen
- `assets/icon.svg` – local icon (manifest also references the remote logo)

