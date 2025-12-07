
from sqlalchemy import String, Integer, Boolean, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base

class Channel(Base):
    __tablename__ = "channels"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(256), index=True)
    group: Mapped[str | None] = mapped_column(String(256))
    logo_url: Mapped[str | None] = mapped_column(String(1024))
    epg_id: Mapped[str | None] = mapped_column(String(256), index=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True)

    streams: Mapped[list[Stream]] = relationship("Stream", back_populates="channel", cascade="all, delete-orphan")

class Stream(Base):
    __tablename__ = "streams"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    channel_id: Mapped[int] = mapped_column(ForeignKey("channels.id", ondelete="CASCADE"), index=True)
    source_url: Mapped[str] = mapped_column(Text)
    headers_json: Mapped[str | None] = mapped_column(Text)
    priority: Mapped[int] = mapped_column(Integer, default=100)

    channel: Mapped[Channel] = relationship("Channel", back_populates="streams")
