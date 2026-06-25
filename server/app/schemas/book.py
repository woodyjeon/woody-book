from datetime import date

from pydantic import BaseModel


class AuthorOut(BaseModel):
    name: str

    model_config = {"from_attributes": True}


class PublisherOut(BaseModel):
    name: str

    model_config = {"from_attributes": True}


class GenreOut(BaseModel):
    genre: str

    model_config = {"from_attributes": True}


class KeywordOut(BaseModel):
    keyword: str

    model_config = {"from_attributes": True}


class BookListItem(BaseModel):
    id: int
    title: str
    thumbnail: str | None
    category: str | None
    introduce: str | None
    is_adult: bool
    authors: list[AuthorOut]
    genres: list[GenreOut]
    avg_rating: float
    count_rating: int

    model_config = {"from_attributes": True}


class BookDetail(BaseModel):
    id: int
    isbn: str | None
    title: str
    thumbnail: str | None
    published_date: date | None
    category: str | None
    introduce: str | None
    is_adult: bool
    authors: list[AuthorOut]
    publishers: list[PublisherOut]
    genres: list[GenreOut]
    keywords: list[KeywordOut]
    avg_rating: float
    count_rating: int
    wish_count: int

    model_config = {"from_attributes": True}


class PaginatedBooks(BaseModel):
    items: list[BookListItem]
    page: int
    size: int
    total: int
