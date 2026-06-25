from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base


class Comment(Base):
    __tablename__ = "comment"

    id: Mapped[int] = mapped_column(primary_key=True)
    book_id: Mapped[int] = mapped_column(ForeignKey("book.id"))
    member_id: Mapped[int] = mapped_column(ForeignKey("member.id"))
    contents: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    book: Mapped["Book"] = relationship(back_populates="comments")
    member: Mapped["Member"] = relationship(back_populates="comments")
