import enum
from datetime import date, datetime

from sqlalchemy import Date, DateTime, Enum, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base


class Gender(str, enum.Enum):
    F = "F"
    M = "M"


class Platform(str, enum.Enum):
    local = "local"
    google = "google"


class Member(Base):
    __tablename__ = "member"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[str | None] = mapped_column(String(50), unique=True)
    password_hash: Mapped[str | None] = mapped_column(String(255))
    nickname: Mapped[str] = mapped_column(String(20))
    email: Mapped[str | None] = mapped_column(String(120), unique=True)
    introduce: Mapped[str | None] = mapped_column(String(240))
    birth_year: Mapped[date | None] = mapped_column(Date)
    gender: Mapped[Gender | None] = mapped_column(Enum(Gender, name="gender"))
    platform: Mapped[Platform] = mapped_column(Enum(Platform, name="platform"), default=Platform.local)
    profile_image: Mapped[str | None] = mapped_column(String(500))
    refresh_token_hash: Mapped[str | None] = mapped_column(String(255))
    is_public: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    reviews: Mapped[list["Review"]] = relationship(back_populates="member")
    wishes: Mapped[list["Wish"]] = relationship(back_populates="member")
    comments: Mapped[list["Comment"]] = relationship(back_populates="member")
