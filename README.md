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
- `cluster-assignments.js` – the 1,050 ID-based cluster assignments imported from the workbook
- `manawaji-community-review.csv` – automatic proposals and manual-review records
- `Code.gs` – complete Google Apps Script backend, including classification persistence

## Deploy the classification backend

1. Replace the Apps Script editor contents with `Code.gs`.
2. Under **Project Settings → Script Properties**, create `PIN_PEPPER` with a random secret of at least 24 characters.
3. Because the old pepper was exposed, use a new value and clear the existing `StaffPins` data rows so accounts return to their default-PIN/mandatory-change flow. Keep the header row.
4. Deploy a new web-app version while retaining the same deployment URL.
5. Sign in as Executive and select **Sync classifications**. The action requires the active Executive PIN and performs one batched update of the `Artisans` sheet.
