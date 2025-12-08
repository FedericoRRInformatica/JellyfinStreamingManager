
from fastapi import APIRouter, Response
from .storage import load_json, CH_FILE
from datetime import datetime, timedelta

router = APIRouter()

@router.get('/output/m3u/default.m3u')
async def output_m3u():
    channels = load_json(CH_FILE, [])
    lines = ['#EXTM3U']
    for c in channels:
        attrs = []
        if c.get('tvg_id'): attrs.append(f'tvg-id="{c["tvg_id"]}"')
        if c.get('logo'): attrs.append(f'tvg-logo="{c["logo"]}"')
        if c.get('group'): attrs.append(f'group-title="{c["group"]}"')
        if c.get('number') is not None: attrs.append(f'channel-id="{c["number"]}"')
        line = f'#EXTINF:-1 {" ".join(attrs)},{c.get("name","Channel")}'
        lines.append(line)
        lines.append(c['url'])
    text = '
'.join(lines) + '
'
    return Response(text, media_type='audio/x-mpegurl')

@router.get('/output/xmltv/default.xml')
async def output_xmltv():
    # Minimal XMLTV with no real programs, only channels
    channels = load_json(CH_FILE, [])
    xml = ['<?xml version="1.0" encoding="UTF-8"?>','<tv generator-info-name="JSManager">']
    for c in channels:
        cid = c.get('tvg_id') or (c.get('name','').replace(' ','_') or 'ch')
        xml.append(f'  <channel id="{cid}">')
        xml.append(f'    <display-name>{c.get("name","Channel")}</display-name>')
        if c.get('logo'):
            xml.append(f'    <icon src="{c["logo"]}"/>')
        xml.append('  </channel>')
    xml.append('</tv>')
    return Response('
'.join(xml)+'
', media_type='application/xml')
