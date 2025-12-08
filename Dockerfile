# ---------- STAGE 1: build web (Vite) ----------
FROM node:20-alpine AS webbuild
WORKDIR /app
COPY web/package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; else npm install --no-audit --no-fund; fi
COPY web/ .
RUN npm run build

# ---------- STAGE 2: final image (FastAPI + Uvicorn) ----------
FROM python:3.11-slim
ENV PYTHONUNBUFFERED=1 \
    JSM_DATA_DIR=/data \
    JSM_DB_PATH=/data/jsmanager.db

WORKDIR /srv

# Backend deps
COPY api/requirements.txt /srv/api/requirements.txt
RUN pip install --no-cache-dir -r /srv/api/requirements.txt

# Backend code
COPY api/app /srv/api/app

# Dirs
RUN mkdir -p /srv/static && mkdir -p /data

# ⬇️ FIX: copia la build Vite dove FastAPI si aspetta (web/dist)
COPY --from=webbuild /app/dist /srv/api/web/dist

EXPOSE 7373
VOLUME ["/data"]

# Switch to API dir so 'app' is importable
WORKDIR /srv/api

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:7373/').read()" || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7373"]
