
# JellyfinStreamingManager (JSManager)

Gestore playlist **M3U** + guida **XMLTV** per **Jellyfin Live TV**, con profili **Direct** e **Proxy/FFmpeg** (futuro), UI React stile Dispatcharr.

## Funzionalità (MVP)
- Import M3U & XMLTV (stub)
- Output **M3U**: `/output/m3u/default.m3u`
- Output **XMLTV**: `/output/xmltv/default.xml`
- UI static build (Vite + Nginx)

## Deploy rapido (Docker)
```bash
docker run -d -p 7373:7373 ghcr.io/federicorrinformatica/jsmanager-api:latest
docker run -d -p 8081:8081 ghcr.io/federicorrinformatica/jsmanager-web:latest
```

## Collegamento a Jellyfin
In **Dashboard → Live TV**:
- **Tuner M3U**: `http://<host>:7373/output/m3u/default.m3u`
- **TV Guide (XMLTV)**: `http://<host>:7373/output/xmltv/default.xml`

## Build & Push su GHCR (Actions)
La repo include 2 workflow:
- `.github/workflows/build-api.yml`
- `.github/workflows/build-web.yml`

Usano `GITHUB_TOKEN` con permessi `packages: write` per pushare su **GHCR**, e **Buildx** per immagini **multi‑arch** (amd64 + arm64).

## TODO / Roadmap
- Ingest M3U dinamico, parsing canali/streams
- Ingest XMLTV e mapping EPG ai canali
- Profili **Direct** (default, zero upload) e **Proxy/FFmpeg** (copy/transcode) con UA/headers, reconnect/timeout
- Sezione **VODs** (liste VOD, collezioni, metadata)
- Health & logs (WS), fallback streams

## Note legali
Assicurati di avere i diritti per le liste/EPG usate. JSManager è un gestore tecnico; l’utente è responsabile dei contenuti caricati.
