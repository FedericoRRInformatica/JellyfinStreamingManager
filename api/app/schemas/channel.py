
from pydantic import BaseModel, Field
from typing import Optional, List

class StreamIn(BaseModel):
    source_url: str
    headers_json: Optional[str] = None
    priority: int = 100

class StreamOut(StreamIn):
    id: int
    class Config:
        from_attributes = True

class ChannelBase(BaseModel):
    name: str
    group: Optional[str] = None
    logo_url: Optional[str] = None
    epg_id: Optional[str] = None
    active: bool = True

class ChannelCreate(ChannelBase):
    streams: List[StreamIn] = Field(default_factory=list)

class ChannelUpdate(BaseModel):
    name: Optional[str] = None
    group: Optional[str] = None
    logo_url: Optional[str] = None
    epg_id: Optional[str] = None
    active: Optional[bool] = None
    streams: Optional[List[StreamIn]] = None

class ChannelOut(ChannelBase):
    id: int
    streams: List[StreamOut] = Field(default_factory=list)
    class Config:
        from_attributes = True
