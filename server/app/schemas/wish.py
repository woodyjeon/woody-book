from pydantic import BaseModel

from app.schemas.book import AuthorOut, GenreOut


class WishStatus(BaseModel):
    is_wished: bool


class WishedBook(BaseModel):
    id: int
    title: str
    thumbnail: str | None
    category: str | None
    introduce: str | None
    is_adult: bool
    authors: list[AuthorOut]
    genres: list[GenreOut]

    model_config = {"from_attributes": True}


class PaginatedWishes(BaseModel):
    items: list[WishedBook]
    page: int
    size: int
    total: int
