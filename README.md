
# JellyfinStreamingManager (JSManager) — Unified Image (lowercase tag fix)

Immagine **unica** (Web+API) che ascolta su **porta 7373**.

## Endpoints
- UI: `http://<host>:7373/`
- M3U: `http://<host>:7373/output/m3u/default.m3u`
- XMLTV: `http://<host>:7373/output/xmltv/default.xml`

## Build & Push (GitHub Actions → GHCR)
Workflow: `.github/workflows/build-jsmanager.yml` (multi‑arch amd64+arm64). Usa `OWNER_LC` per forzare il nome repository in **minuscolo**.

## Run
```bash
docker run -d -p 7373:7373 ghcr.io/federicorrinformatica/jsmanager:latest
```

## Note
- Nginx serve gli statici e fa reverse-proxy verso Uvicorn (8000) internamente.
- I tag GHCR richiedono repos **lowercase**; il workflow calcola automaticamente l'owner in minuscolo.
