
from fastapi import APIRouter, HTTPException
from .models import Channel, M3UImport
from .storage import load_json, save_json, CH_FILE
import httpx
import re

router = APIRouter(prefix='/api')

M3U_EXTINF = re.compile(r'^#EXTINF:-?\d+\s*(.*),\s*(.*)$')
ATTR = re.compile(r'(\w+?)="(.*?)"')


def parse_m3u(text: str):
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    if not lines or not lines[0].startswith('#EXTM3U'):
        raise ValueError('M3U non valido')
    items = []
    i = 0
    while i < len(lines):
        if lines[i].startswith('#EXTINF'):
            m = M3U_EXTINF.match(lines[i])
            attrs = {}
            name = ''
            if m:
                raw_attrs, name = m.groups()
                for a,v in ATTR.findall(raw_attrs):
                    attrs[a.lower()] = v
            # next line should be url
            if i+1 < len(lines):
                url = lines[i+1]
                items.append({
                    'name': name or attrs.get('tvg-name') or 'Senza nome',
                    'url': url,
                    'group': attrs.get('group-title'),
                    'tvg_id': attrs.get('tvg-id') or attrs.get('tvc-guide-stationid'),
                    'logo': attrs.get('tvg-logo')
                })
                i += 2
            else:
                i += 1
        else:
            i += 1
    return items

@router.get('/channels')
async def get_channels():
    return load_json(CH_FILE, [])

@router.post('/providers/m3u/url')
async def import_m3u_url(body: M3UImport):
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=30) as client:
            r = await client.get(str(body.url))
            r.raise_for_status()
            entries = parse_m3u(r.text)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f'Import M3U fallito: {e}')
    data = load_json(CH_FILE, [])
    data.extend(entries)
    save_json(CH_FILE, data)
    return {'imported': len(entries), 'total': len(data)}
