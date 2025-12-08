
from pydantic import BaseModel, HttpUrl
from typing import Optional

class Channel(BaseModel):
    name: str
    url: str
    group: Optional[str] = None
    number: Optional[int] = None
    tvg_id: Optional[str] = None
    logo: Optional[str] = None

class M3UImport(BaseModel):
    url: HttpUrl

class EPGSource(BaseModel):
    url: HttpUrl
