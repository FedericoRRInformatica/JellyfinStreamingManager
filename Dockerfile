
# ---------- STAGE 1: build web (Vite) ----------
FROM node:20-alpine AS webbuild
WORKDIR /app

# Copy manifests only
COPY web/package*.json ./

# Use npm ci if lock exists, else fallback to npm install
RUN if [ -f package-lock.json ]; then       npm ci --no-audit --no-fund;     else       npm install --no-audit --no-fund;     fi

# Copy sources and build
COPY web/ .
RUN npm run build

# ---------- STAGE 2: final image (FastAPI + Uvicorn) ----------
FROM python:3.11-slim
ENV PYTHONUNBUFFERED=1     JSM_DATA_DIR=/data
WORKDIR /srv

# Install deps
COPY api/requirements.txt /srv/api/requirements.txt
RUN pip install --no-cache-dir -r /srv/api/requirements.txt

# Copy API
COPY api/app /srv/api/app

# Copy web build to static dir
RUN mkdir -p /srv/static
COPY --from=webbuild /app/dist /srv/static

# Ensure data dir exists
RUN mkdir -p /data

# Expose single port
EXPOSE 7373

# Declare persistent volume for settings/data
VOLUME ["/data"]

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3   CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:7373/').read()" || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7373"]
