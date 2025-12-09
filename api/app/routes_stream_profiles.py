
from fastapi import APIRouter, HTTPException
from .storage import load_settings, save_settings, ensure_default_profiles
from typing import List, Dict, Any

router = APIRouter(prefix='/api')

@router.get('/stream-profiles')
async def get_stream_profiles():
    settings = ensure_default_profiles(load_settings())
    return settings.get('stream_profiles', [])

@router.post('/stream-profiles')
async def add_stream_profile(body: Dict[str, Any]):
    settings = ensure_default_profiles(load_settings())
    profiles: List[Dict[str, Any]] = settings.get('stream_profiles', [])
    pid = body.get('id')
    if not pid:
        # simple id generation from name
        name = (body.get('name') or 'profile').lower().replace(' ', '-')
        base_id = name or 'profile'
        i = 1
        pid = base_id
        ids = {p.get('id') for p in profiles}
        while pid in ids:
            i += 1
            pid = f"{base_id}-{i}"
        body['id'] = pid
    # forbid duplicates
    if any(p.get('id') == pid for p in profiles):
        raise HTTPException(status_code=400, detail='ID profilo già esistente')
    # defaults
    body.setdefault('active', True)
    body.setdefault('type', 'custom')
    profiles.append(body)
    save_settings({'stream_profiles': profiles})
    return body

@router.put('/stream-profiles/{pid}')
async def update_stream_profile(pid: str, body: Dict[str, Any]):
    settings = ensure_default_profiles(load_settings())
    profiles: List[Dict[str, Any]] = settings.get('stream_profiles', [])
    found = False
    for p in profiles:
        if p.get('id') == pid:
            p.update({k: v for k, v in body.items() if k != 'id'})
            found = True
            break
    if not found:
        raise HTTPException(status_code=404, detail='Profilo non trovato')
    save_settings({'stream_profiles': profiles})
    return {'ok': True}

@router.delete('/stream-profiles/{pid}')
async def delete_stream_profile(pid: str):
    if pid in ('redirect','ffmpeg'):
        raise HTTPException(status_code=400, detail='Non è possibile eliminare i profili di base')
    settings = ensure_default_profiles(load_settings())
    profiles: List[Dict[str, Any]] = settings.get('stream_profiles', [])
    new_list = [p for p in profiles if p.get('id') != pid]
    if len(new_list) == len(profiles):
        raise HTTPException(status_code=404, detail='Profilo non trovato')
    save_settings({'stream_profiles': new_list})
    return {'ok': True}
