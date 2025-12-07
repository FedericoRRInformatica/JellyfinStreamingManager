
from fastapi import APIRouter, Response

router = APIRouter(prefix="/output", tags=["output"])

@router.get("/m3u/default.m3u", response_class=Response)
def m3u_default():
    text = "#EXTM3U
#EXTINF:-1 tvg-id="demo" group-title="Demo",Demo Channel
http://example.com/live/demo.ts
"
    return Response(content=text, media_type="audio/x-mpegurl")

@router.get("/xmltv/default.xml", response_class=Response)
def xmltv_default():
    xml = """<?xml version="1.0" encoding="UTF-8"?>
<tv generator-info-name="JSManager">
  <channel id="demo"><display-name>Demo Channel</display-name></channel>
  <programme start="20251207140000 +0000" stop="20251207150000 +0000" channel="demo">
    <title>Programma Demo</title>
    <desc>Esempio XMLTV</desc>
  </programme>
</tv>"""
    return Response(content=xml, media_type="application/xml")
