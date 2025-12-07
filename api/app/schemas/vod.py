
from pydantic import BaseModel
from typing import Optional, List

class VodCollectionBase(BaseModel):
    name: str
    poster: Optional[str] = None

class VodCollectionCreate(VodCollectionBase):
    pass

class VodCollectionOut(VodCollectionBase):
    id: int
    class Config:
        from_attributes = True

class VodItemBase(BaseModel):
    title: str
    year: Optional[int] = None
    kind: str = "movie"
    poster: Optional[str] = None
    source_url: str
    headers_json: Optional[str] = None
    collection_id: Optional[int] = None

class VodItemCreate(VodItemBase):
    pass

class VodItemUpdate(BaseModel):
    title: Optional[str] = None
    year: Optional[int] = None
    kind: Optional[str] = None
    poster: Optional[str] = None
    source_url: Optional[str] = None
    headers_json: Optional[str] = None
    collection_id: Optional[int] = None

class VodItemOut(VodItemBase):
    id: int
    class Config:
        from_attributes = True
