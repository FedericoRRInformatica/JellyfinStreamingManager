
from pydantic import BaseModel
from typing import Optional

class EpgSourceBase(BaseModel):
    name: str
    xmltv_url: str
    timezone: Optional[str] = None
    priority: int = 100

class EpgSourceCreate(EpgSourceBase):
    pass

class EpgSourceUpdate(BaseModel):
    name: Optional[str] = None
    xmltv_url: Optional[str] = None
    timezone: Optional[str] = None
    priority: Optional[int] = None

class EpgSourceOut(EpgSourceBase):
    id: int
    class Config:
        from_attributes = True
