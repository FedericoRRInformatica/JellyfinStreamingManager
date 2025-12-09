from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4
from .settings_store import load_settings, save_settings

class UserAgent(BaseModel):
    id: str | None = None
    name: str
    value: str
    description: str | None = None
    isActive: bool = True

router = APIRouter()

@router.get('/api/user-agents')
def list_user_agents():
    s = load_settings()
    return s.get('userAgents', [])

@router.post('/api/user-agents')
def create_user_agent(u: UserAgent):
    s = load_settings()
    uas = s.get('userAgents', [])
    uid = u.id or str(uuid4())
    data = u.dict()
    data['id'] = uid
    uas.append(data)
    s['userAgents'] = uas
    save_settings(s)
    return data

@router.put('/api/user-agents/{uid}')
def update_user_agent(uid: str, u: UserAgent):
    s = load_settings()
    uas = s.get('userAgents', [])
    for i, it in enumerate(uas):
        if it.get('id') == uid:
            data = u.dict()
            data['id'] = uid
            uas[i] = data
            s['userAgents'] = uas
            save_settings(s)
            return data
    raise HTTPException(status_code=404, detail='User-Agent non trovato')

@router.delete('/api/user-agents/{uid}')
def delete_user_agent(uid: str):
    s = load_settings()
    uas = s.get('userAgents', [])
    new = [it for it in uas if it.get('id') != uid]
    if len(new) == len(uas):
        raise HTTPException(status_code=404, detail='User-Agent non trovato')
    s['userAgents'] = new
    save_settings(s)
    return { 'ok': True }
