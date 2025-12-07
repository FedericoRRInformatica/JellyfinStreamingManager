
# JellyfinStreamingManager (JSManager) — Locale, porta 7373, DB SQLite in /data

JSManager gira **solo in rete locale**, espone **porta 7373**, serve la UI con **FastAPI** e persiste **settings + dati** in un **volume Docker**.

## Persistenza
- **Settings**: `/data/settings.json`
- **DB**: SQLite in `/data/jsmanager.db`

## Endpoints principali
- UI: `http://<host>:7373/`
- M3U: `http://<host>:7373/output/m3u/default.m3u`
- XMLTV: `http://<host>:7373/output/xmltv/default.xml`
- Settings: `GET/PUT /api/settings`
- Channels: `GET/POST/PUT/PATCH/DELETE /api/channels[/ {id}]`
- EPG Sources: `GET/POST/PUT/PATCH/DELETE /api/epg/sources[/ {id}]`
- VOD Collections: `GET/POST/DELETE /api/vod/collections[/ {id}]`
- VOD Items: `GET/POST/GET(id)/PUT/PATCH/DELETE /api/vod/items[/ {id}]`

## Run (con volume)
```bash
docker run -d   -p 7373:7373   -v jsmanager_data:/data   --name jsmanager   ghcr.io/federicorrinformatica/jsmanager:latest
```

## Build & Push (GHCR)
Workflow: `.github/workflows/build-jsmanager.yml` (multi‑arch), tag con owner **lowercase**.

## Note
- Se aggiungi `web/package-lock.json` userai `npm ci`; altrimenti il build fa fallback a `npm install`.
- Le tabelle DB sono create automaticamente all'avvio (strategia semplice senza migrazioni per il MVP).
