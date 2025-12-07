
import os
import json
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# --- Config ---
DATA_DIR = Path(os.getenv("JSM_DATA_DIR", "/data"))
SETTINGS_FILE = DATA_DIR / "settings.json"
STATIC_DIR = Path("/srv/static")

app = FastAPI(title="JSManager API")

# Ensure data dir exists on startup
DATA_DIR.mkdir(parents=True, exist_ok=True)
if not SETTINGS_FILE.exists():
    SETTINGS_FILE.write_text(json.dumps({"brand": "JSManager", "port": 7373}, ensure_ascii=False, indent=2), encoding="utf-8")

# --- Models ---
class Settings(BaseModel):
    brand: str | None = None
    port: int | None = None
    theme: str | None = None

# --- Settings Endpoints ---
@app.get("/api/settings", response_model=Settings)
def read_settings():
    try:
        data = json.loads(SETTINGS_FILE.read_text(encoding="utf-8"))
        return Settings(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read settings: {e}")

@app.put("/api/settings", response_model=Settings)
def write_settings(payload: Settings):
    try:
        current = {}
        if SETTINGS_FILE.exists():
            current = json.loads(SETTINGS_FILE.read_text(encoding="utf-8"))
        merged = {**current, **{k: v for k, v in payload.dict().items() if v is not None}}
        SETTINGS_FILE.write_text(json.dumps(merged, ensure_ascii=False, indent=2), encoding="utf-8")
        return Settings(**merged)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to write settings: {e}")

# --- Demo Output endpoints ---
@app.get("/output/m3u/default.m3u")
def m3u_default():
    text = "#EXTM3U
#EXTINF:-1 tvg-id="demo" group-title="Demo",Demo Channel
http://example.com/live/demo.ts
"
    return FileResponse(path=str((DATA_DIR / "m3u_default.m3u").resolve()), filename="default.m3u") if False else text

@app.get("/output/xmltv/default.xml")
def xmltv_default():
    xml = """<?xml version="1.0" encoding="UTF-8"?>
<tv generator-info-name="JSManager">
  <channel id="demo"><display-name>Demo Channel</display-name></channel>
  <programme start="20251207140000 +0000" stop="20251207150000 +0000" channel="demo">
    <title>Programma Demo</title>
    <desc>Esempio XMLTV</desc>
  </programme>
</tv>"""
    return xml

# --- Static UI ---
if STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")

# Catch-all to return index.html for SPA routes if static dir present
@app.get("/{full_path:path}")
def spa_fallback(full_path: str):
    index_path = STATIC_DIR / "index.html"
    if STATIC_DIR.exists() and index_path.exists():
        return FileResponse(str(index_path))
    return {"ok": True, "message": "JSManager API", "path": full_path}
