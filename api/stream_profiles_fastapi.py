from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from uuid import uuid4
from .settings_store import load_settings, save_settings

class Profile(BaseModel):
    id: str | None = None
    name: str
    command: str | None = None
    parameters: str | None = None
    userAgent: str | None = None
    active: bool = True

router = APIRouter()

@router.get('/api/stream-profiles')
def list_profiles():
    s = load_settings()
    return s.get('profiles', [])

@router.post('/api/stream-profiles')
def create_profile(p: Profile):
    s = load_settings()
    profs = s.get('profiles', [])
    pid = p.id or str(uuid4())
    data = p.dict()
    data['id'] = pid
    profs.append(data)
    s['profiles'] = profs
    save_settings(s)
    return data

@router.put('/api/stream-profiles/{pid}')
def update_profile(pid: str, p: Profile):
    s = load_settings()
    profs = s.get('profiles', [])
    for i, it in enumerate(profs):
        if it.get('id') == pid:
            data = p.dict()
            data['id'] = pid
            profs[i] = data
            s['profiles'] = profs
            save_settings(s)
            return data
    raise HTTPException(status_code=404, detail='Profilo non trovato')

@router.delete('/api/stream-profiles/{pid}')
def delete_profile(pid: str):
    s = load_settings()
    profs = s.get('profiles', [])
    new = [it for it in profs if it.get('id') != pid]
    if len(new) == len(profs):
        raise HTTPException(status_code=404, detail='Profilo non trovato')
    s['profiles'] = new
    save_settings(s)
    return { 'ok': True }
