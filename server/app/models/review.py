from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base


class Review(Base):
    __tablename__ = "review"
    __table_args__ = (UniqueConstraint("book_id", "member_id", name="uq_review_book_member"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    book_id: Mapped[int] = mapped_column(ForeignKey("book.id"))
    member_id: Mapped[int] = mapped_column(ForeignKey("member.id"))
    contents: Mapped[str | None] = mapped_column(Text)
    rating: Mapped[float | None] = mapped_column(Float)
    is_spoiler: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    book: Mapped["Book"] = relationship(back_populates="reviews")
    member: Mapped["Member"] = relationship(back_populates="reviews")
