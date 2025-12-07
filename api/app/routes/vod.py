
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app.models.vod import VodCollection, VodItem
from app.schemas.vod import (
    VodCollectionCreate, VodCollectionOut,
    VodItemCreate, VodItemUpdate, VodItemOut
)

router = APIRouter(prefix="/api/vod", tags=["vod"])

# Collections
@router.get("/collections", response_model=List[VodCollectionOut])
def list_collections(db: Session = Depends(get_db)):
    return db.query(VodCollection).order_by(VodCollection.name.asc()).all()

@router.post("/collections", response_model=VodCollectionOut, status_code=201)
def create_collection(payload: VodCollectionCreate, db: Session = Depends(get_db)):
    obj = VodCollection(**payload.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/collections/{collection_id}", status_code=204)
def delete_collection(collection_id: int, db: Session = Depends(get_db)):
    obj = db.get(VodCollection, collection_id)
    if not obj:
        return
    db.delete(obj)
    db.commit()

# Items
@router.get("/items", response_model=List[VodItemOut])
def list_items(db: Session = Depends(get_db)):
    return db.query(VodItem).order_by(VodItem.title.asc()).all()

@router.post("/items", response_model=VodItemOut, status_code=201)
def create_item(payload: VodItemCreate, db: Session = Depends(get_db)):
    obj = VodItem(**payload.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.get("/items/{item_id}", response_model=VodItemOut)
def get_item(item_id: int, db: Session = Depends(get_db)):
    obj = db.get(VodItem, item_id)
    if not obj:
        raise HTTPException(status_code=404, detail="VOD item not found")
    return obj

@router.put("/items/{item_id}", response_model=VodItemOut)
@router.patch("/items/{item_id}", response_model=VodItemOut)
def update_item(item_id: int, payload: VodItemUpdate, db: Session = Depends(get_db)):
    obj = db.get(VodItem, item_id)
    if not obj:
        raise HTTPException(status_code=404, detail="VOD item not found")
    data = payload.dict(exclude_unset=True)
    for k, v in data.items():
        setattr(obj, k, v)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    obj = db.get(VodItem, item_id)
    if not obj:
        return
    db.delete(obj)
    db.commit()
