
# JellyfinStreamingManager (JSManager) — Unified Image (npm ci fallback)

Immagine **unica** (Web+API) su **porta 7373**.

## Endpoints
- UI: `http://<host>:7373/`
- M3U: `http://<host>:7373/output/m3u/default.m3u`
- XMLTV: `http://<host>:7373/output/xmltv/default.xml`

## Build & Push (GitHub Actions → GHCR)
Workflow: `.github/workflows/build-jsmanager.yml` (multi‑arch amd64+arm64), con owner **lowercase**.

## NPM: perché il fallback
- In CI, `npm ci` richiede un **package-lock.json** valido e in sync con `package.json`; se manca o è fuori sync, fallisce (è by‑design per build deterministici).
- Il nostro Dockerfile usa: **se c’è il lock → `npm ci`**, altrimenti **fallback a `npm install`**.
- Best‑practice: committa `web/package-lock.json` e torni a `npm ci` puro.

## Run
```bash
docker run -d -p 7373:7373 ghcr.io/federicorrinformatica/jsmanager:latest
```

## Note
- Nginx serve gli statici e fa reverse-proxy verso Uvicorn (8000) internamente.
- `.npmrc` riduce rumore di audit/fund nei log.
