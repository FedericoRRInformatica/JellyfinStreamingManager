from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .settings_store import load_settings, save_settings, is_path_allowed, ensure_dir

class VodUpdatePayload(BaseModel):
    basePath: str
    createIfMissing: bool = True

router = APIRouter()

@router.get('/api/vod-settings')
def get_vod_settings():
    s = load_settings()
    return s.get('vodSettings', {"basePath": "/VOD"})

@router.post('/api/vod-settings')
def update_vod_settings(payload: VodUpdatePayload):
    base = payload.basePath.strip()
    if not is_path_allowed(base):
        raise HTTPException(status_code=400, detail='Percorso non valido: deve essere assoluto e sotto /VOD')
    if payload.createIfMissing:
        ensure_dir(base)
    s = load_settings()
    s.setdefault('vodSettings', {})
    s['vodSettings']['basePath'] = base
    save_settings(s)
    return s['vodSettings']
