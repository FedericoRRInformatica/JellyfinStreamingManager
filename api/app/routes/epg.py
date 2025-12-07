
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app.models.epg import EpgSource
from app.schemas.epg import EpgSourceCreate, EpgSourceOut, EpgSourceUpdate

router = APIRouter(prefix="/api/epg", tags=["epg"])

@router.get("/sources", response_model=List[EpgSourceOut])
def list_sources(db: Session = Depends(get_db)):
    return db.query(EpgSource).order_by(EpgSource.priority.asc()).all()

@router.post("/sources", response_model=EpgSourceOut, status_code=201)
def create_source(payload: EpgSourceCreate, db: Session = Depends(get_db)):
    obj = EpgSource(**payload.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.put("/sources/{source_id}", response_model=EpgSourceOut)
@router.patch("/sources/{source_id}", response_model=EpgSourceOut)
def update_source(source_id: int, payload: EpgSourceUpdate, db: Session = Depends(get_db)):
    obj = db.get(EpgSource, source_id)
    if not obj:
        raise HTTPException(status_code=404, detail="EPG source not found")
    data = payload.dict(exclude_unset=True)
    for k, v in data.items():
        setattr(obj, k, v)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/sources/{source_id}", status_code=204)
def delete_source(source_id: int, db: Session = Depends(get_db)):
    obj = db.get(EpgSource, source_id)
    if not obj:
        return
    db.delete(obj)
    db.commit()
