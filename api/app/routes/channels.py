
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app.models.channel import Channel, Stream
from app.schemas.channel import ChannelCreate, ChannelOut, ChannelUpdate, StreamIn

router = APIRouter(prefix="/api/channels", tags=["channels"])

@router.get("/", response_model=List[ChannelOut])
def list_channels(db: Session = Depends(get_db)):
    return db.query(Channel).order_by(Channel.name.asc()).all()

@router.post("/", response_model=ChannelOut, status_code=201)
def create_channel(payload: ChannelCreate, db: Session = Depends(get_db)):
    ch = Channel(name=payload.name, group=payload.group, logo_url=payload.logo_url, epg_id=payload.epg_id, active=payload.active)
    for s in payload.streams:
        ch.streams.append(Stream(source_url=s.source_url, headers_json=s.headers_json, priority=s.priority))
    db.add(ch)
    db.commit()
    db.refresh(ch)
    return ch

@router.get("/{channel_id}", response_model=ChannelOut)
def get_channel(channel_id: int, db: Session = Depends(get_db)):
    ch = db.get(Channel, channel_id)
    if not ch:
        raise HTTPException(status_code=404, detail="Channel not found")
    return ch

@router.put("/{channel_id}", response_model=ChannelOut)
@router.patch("/{channel_id}", response_model=ChannelOut)
def update_channel(channel_id: int, payload: ChannelUpdate, db: Session = Depends(get_db)):
    ch = db.get(Channel, channel_id)
    if not ch:
        raise HTTPException(status_code=404, detail="Channel not found")
    data = payload.dict(exclude_unset=True)
    # Streams replace if provided
    streams = data.pop('streams', None)
    for k, v in data.items():
        setattr(ch, k, v)
    if streams is not None:
        ch.streams.clear()
        for s in streams:
            ch.streams.append(Stream(source_url=s.source_url, headers_json=s.headers_json, priority=s.priority))
    db.add(ch)
    db.commit()
    db.refresh(ch)
    return ch

@router.delete("/{channel_id}", status_code=204)
def delete_channel(channel_id: int, db: Session = Depends(get_db)):
    ch = db.get(Channel, channel_id)
    if not ch:
        return
    db.delete(ch)
    db.commit()
