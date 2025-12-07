
# JellyfinStreamingManager (JSManager) — Immagine Unificata (Web + API)

> **One container, one port (7373).**  
> JSManager fornisce un endpoint **M3U** e una guida **XMLTV** pronti per **Jellyfin Live TV** e serve una UI minimale per il setup.  
> L’immagine unificata integra **Web (Nginx)** + **API (FastAPI/Uvicorn)** dietro a un reverse‑proxy, esponendo **una sola porta: 7373**.

---

## ✨ Funzioni (MVP)
- **Output M3U** di test: `/output/m3u/default.m3u`
- **Output XMLTV** di test: `/output/xmltv/default.xml`
- **UI** minima (React + Vite) servita da **Nginx**
- Immagine **multi‑arch** (amd64 + arm64) pubblicata su **GHCR**
- Deploy **single pull**: `docker run -p 7373:7373 ghcr.io/FedericoRRInformatica/jsmanager:latest`

> Le funzioni evolveranno rapidamente con: ingest M3U/XMLTV reali, profili **Direct** e **Proxy/FFmpeg**, VODs, health/logs, fallback.

---

## 🏗 Architettura (porta unica 7373)
