
from sqlalchemy import String, Integer, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base

class VodCollection(Base):
    __tablename__ = "vod_collections"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(256), unique=True)
    poster: Mapped[str | None] = mapped_column(String(1024))

    items: Mapped[list[VodItem]] = relationship("VodItem", back_populates="collection", cascade="all, delete-orphan")

class VodItem(Base):
    __tablename__ = "vod_items"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(512))
    year: Mapped[int | None] = mapped_column(Integer)
    kind: Mapped[str] = mapped_column(String(32), default="movie")  # movie|series|episode
    poster: Mapped[str | None] = mapped_column(String(1024))
    source_url: Mapped[str] = mapped_column(Text)
    headers_json: Mapped[str | None] = mapped_column(Text)

    collection_id: Mapped[int | None] = mapped_column(ForeignKey("vod_collections.id", ondelete="SET NULL"))
    collection: Mapped[VodCollection | None] = relationship("VodCollection", back_populates="items")
