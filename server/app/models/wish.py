from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base


class Wish(Base):
    __tablename__ = "wish"
    __table_args__ = (UniqueConstraint("book_id", "member_id", name="uq_wish_book_member"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    book_id: Mapped[int] = mapped_column(ForeignKey("book.id"))
    member_id: Mapped[int] = mapped_column(ForeignKey("member.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    book: Mapped["Book"] = relationship(back_populates="wishes")
    member: Mapped["Member"] = relationship(back_populates="wishes")
