
from pathlib import Path
from fastapi import FastAPI, Body
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import json

app = FastAPI()

DATA_DIR = Path('data')
SETTINGS_FILE = DATA_DIR / 'settings.json'
DATA_DIR.mkdir(parents=True, exist_ok=True)

DEFAULT_SETTINGS = {"brand": "JSManager", "port": 7373, "theme": None}

@app.get('/api/settings')
def get_settings():
    if SETTINGS_FILE.exists():
        try:
            return json.loads(SETTINGS_FILE.read_text('utf-8'))
        except Exception:
            pass
    return DEFAULT_SETTINGS

@app.put('/api/settings')
def put_settings(payload: dict = Body(...)):
    SETTINGS_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding='utf-8')
    return JSONResponse(payload)

app.mount('/', StaticFiles(directory='web/dist', html=True), name='static')
