from fastapi import APIRouter, HTTPException
from .settings_store import load_settings, save_settings, is_valid_ids

router = APIRouter()

@router.get('/api/stream-settings')
def get_stream_settings():
    s = load_settings()
    return s.get('streamSettings', {})

@router.post('/api/stream-settings')
def update_stream_settings(payload: dict):
    s = load_settings()
    ua = payload.get('defaultUserAgentId')
    pr = payload.get('defaultStreamProfileId')
    if not is_valid_ids(s, ua, pr):
        raise HTTPException(status_code=400, detail='ID non valido o non attivo')
    s.setdefault('streamSettings', {})
    s['streamSettings']['defaultUserAgentId'] = ua
    s['streamSettings']['defaultStreamProfileId'] = pr
    save_settings(s)
    return s['streamSettings']

@router.get('/healthz')
def healthz():
    return 'OK'
