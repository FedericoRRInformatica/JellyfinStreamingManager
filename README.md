
# JellyfinStreamingManager (JSManager) — Locale, porta 7373, senza Nginx

JSManager gira **solo in rete locale**, espone **una sola porta (7373)**, serve la UI statica direttamente da **FastAPI** e persiste le impostazioni in un **volume Docker**.

## Endpoints
- UI: `http://<host>:7373/`
- M3U: `http://<host>:7373/output/m3u/default.m3u`
- XMLTV: `http://<host>:7373/output/xmltv/default.xml`
- API Settings: `GET/PUT http://<host>:7373/api/settings`

## Persistenza (volume Docker)
L'immagine dichiara `VOLUME /data`. Monta un volume/named volume per preservare le impostazioni:

```bash
docker run -d   -p 7373:7373   -v jsmanager_data:/data   --name jsmanager   ghcr.io/federicorrinformatica/jsmanager:latest
```

Oppure con compose:
```yaml
version: "3.9"
services:
  jsmanager:
    image: ghcr.io/federicorrinformatica/jsmanager:latest
    ports: ["7373:7373"]
    volumes:
      - jsmanager_data:/data
volumes:
  jsmanager_data:
```

## Build & Push (GitHub Actions → GHCR)
Workflow: `.github/workflows/build-jsmanager.yml` (multi‑arch amd64+arm64), con owner **lowercase**.

## Nota su `npm ci`
Il build dello UI usa `npm ci` **se** esiste `web/package-lock.json`; altrimenti **fallback** a `npm install`. Per build deterministici, genera e committa il lockfile.

## Run
```bash
docker run -d -p 7373:7373 -v jsmanager_data:/data ghcr.io/federicorrinformatica/jsmanager:latest
```

## Jellyfin
In **Dashboard → Live TV** incolla gli endpoint M3U/XMLTV sopra.
