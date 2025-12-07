
# ---------- STAGE 1: build web (Vite) ----------
FROM node:20-alpine AS webbuild
WORKDIR /app

# Copia solo i manifest per install
aDd web/package*.json ./

# Se esiste il lock, usa npm ci; altrimenti fallback a npm install
RUN if [ -f package-lock.json ]; then       npm ci --no-audit --no-fund;     else       npm install --no-audit --no-fund;     fi

# Ora copia il resto del codice e builda
COPY web/ .
RUN npm run build

# ---------- STAGE 2: prepare api (python deps) ----------
FROM python:3.11-slim AS apiprep
WORKDIR /app
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY api/app ./app

# ---------- STAGE 3: final image (Nginx + Uvicorn + supervisord) ----------
FROM python:3.11-slim
ENV PYTHONUNBUFFERED=1
WORKDIR /srv

# Install Nginx e supervisord
RUN apt-get update && apt-get install -y --no-install-recommends nginx supervisor  && rm -rf /var/lib/apt/lists/*

# Copia API dal stage apiprep
COPY --from=apiprep /app /srv/api

# Copia web statici dal stage webbuild
COPY --from=webbuild /app/dist /usr/share/nginx/html

# Nginx config (porta 7373, proxy verso Uvicorn:8000)
COPY web/nginx.7373.conf /etc/nginx/nginx.conf

# Supervisord (avvia nginx + uvicorn)
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Espone la porta unica
EXPOSE 7373

# Healthcheck semplice (opzionale)
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3   CMD wget -qO- http://127.0.0.1:7373/ || exit 1

CMD ["supervisord", "-n"]
