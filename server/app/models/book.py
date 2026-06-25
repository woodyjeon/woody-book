from datetime import date

from sqlalchemy import Boolean, Date, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base


class Book(Base):
    __tablename__ = "book"

    id: Mapped[int] = mapped_column(primary_key=True)
    isbn: Mapped[str | None] = mapped_column(String(13))
    title: Mapped[str] = mapped_column(String(200))
    thumbnail: Mapped[str | None] = mapped_column(String(500))
    published_date: Mapped[date | None] = mapped_column(Date)
    category: Mapped[str | None] = mapped_column(String(20))
    introduce: Mapped[str | None] = mapped_column(Text)
    is_adult: Mapped[bool] = mapped_column(Boolean, default=False)
    source_url: Mapped[str | None] = mapped_column(String(2083))

    authors: Mapped[list["Author"]] = relationship(back_populates="book", cascade="all, delete-orphan")
    publishers: Mapped[list["Publisher"]] = relationship(back_populates="book", cascade="all, delete-orphan")
    genres: Mapped[list["Genre"]] = relationship(back_populates="book", cascade="all, delete-orphan")
    keywords: Mapped[list["Keyword"]] = relationship(back_populates="book", cascade="all, delete-orphan")
    reviews: Mapped[list["Review"]] = relationship(back_populates="book", cascade="all, delete-orphan")
    wishes: Mapped[list["Wish"]] = relationship(back_populates="book", cascade="all, delete-orphan")
    comments: Mapped[list["Comment"]] = relationship(back_populates="book", cascade="all, delete-orphan")


class Author(Base):
    __tablename__ = "author"

    id: Mapped[int] = mapped_column(primary_key=True)
    book_id: Mapped[int] = mapped_column(ForeignKey("book.id"))
    name: Mapped[str] = mapped_column(String(100))

    book: Mapped["Book"] = relationship(back_populates="authors")


class Publisher(Base):
    __tablename__ = "publisher"

    id: Mapped[int] = mapped_column(primary_key=True)
    book_id: Mapped[int] = mapped_column(ForeignKey("book.id"))
    name: Mapped[str] = mapped_column(String(100))

    book: Mapped["Book"] = relationship(back_populates="publishers")


class Genre(Base):
    __tablename__ = "genre"

    id: Mapped[int] = mapped_column(primary_key=True)
    book_id: Mapped[int] = mapped_column(ForeignKey("book.id"))
    genre: Mapped[str] = mapped_column(String(50))

    book: Mapped["Book"] = relationship(back_populates="genres")


class Keyword(Base):
    __tablename__ = "keyword"

    id: Mapped[int] = mapped_column(primary_key=True)
    book_id: Mapped[int] = mapped_column(ForeignKey("book.id"))
    keyword: Mapped[str] = mapped_column(String(50))

    book: Mapped["Book"] = relationship(back_populates="keywords")
