from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.db import get_db
from app.models.book import Book, Genre
from app.models.review import Review
from app.models.wish import Wish
from app.schemas.book import BookDetail, BookListItem, PaginatedBooks

router = APIRouter(prefix="/books", tags=["books"])


@router.get("", response_model=PaginatedBooks)
async def list_books(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    category: str | None = None,
    genre: str | None = None,
    sort: Literal["rating", "count", "random"] = "count",
    seed: int | None = None,
    db: AsyncSession = Depends(get_db),
) -> PaginatedBooks:
    rating_subq = (
        select(
            Review.book_id.label("book_id"),
            func.avg(Review.rating).label("avg_rating"),
            func.count(Review.id).label("count_rating"),
        )
        .group_by(Review.book_id)
        .subquery()
    )
    avg_rating_col = func.coalesce(rating_subq.c.avg_rating, 0.0)
    count_rating_col = func.coalesce(rating_subq.c.count_rating, 0)

    def apply_filters(stmt):
        if category:
            stmt = stmt.where(Book.category == category)
        if genre:
            stmt = stmt.where(Book.id.in_(select(Genre.book_id).where(Genre.genre == genre)))
        return stmt

    total = await db.scalar(apply_filters(select(func.count(Book.id))))

    stmt = apply_filters(
        select(Book, avg_rating_col, count_rating_col)
        .outerjoin(rating_subq, rating_subq.c.book_id == Book.id)
        .options(selectinload(Book.authors), selectinload(Book.genres))
    )

    if sort == "rating":
        stmt = stmt.order_by(avg_rating_col.desc(), Book.id)
    elif sort == "random":
        if seed is not None:
            # deterministic shuffle so paginated requests with the same seed don't repeat/skip rows
            shuffle_key = func.md5(func.concat(Book.id, ":", seed))
            stmt = stmt.order_by(shuffle_key, Book.id)
        else:
            stmt = stmt.order_by(func.random())
    else:
        stmt = stmt.order_by(count_rating_col.desc(), Book.id)

    stmt = stmt.offset((page - 1) * size).limit(size)
    rows = (await db.execute(stmt)).all()

    items = [
        BookListItem(
            id=book.id,
            title=book.title,
            thumbnail=book.thumbnail,
            category=book.category,
            introduce=book.introduce,
            is_adult=book.is_adult,
            authors=book.authors,
            genres=book.genres,
            avg_rating=round(float(avg_rating), 2),
            count_rating=int(count_rating),
        )
        for book, avg_rating, count_rating in rows
    ]
    return PaginatedBooks(items=items, page=page, size=size, total=total or 0)


@router.get("/{book_id}", response_model=BookDetail)
async def get_book(book_id: int, db: AsyncSession = Depends(get_db)) -> BookDetail:
    book = await db.get(
        Book,
        book_id,
        options=[
            selectinload(Book.authors),
            selectinload(Book.publishers),
            selectinload(Book.genres),
            selectinload(Book.keywords),
        ],
    )
    if book is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "책을 찾을 수 없습니다.")

    avg_rating, count_rating = (
        await db.execute(
            select(func.coalesce(func.avg(Review.rating), 0.0), func.count(Review.id)).where(
                Review.book_id == book_id
            )
        )
    ).one()
    wish_count = await db.scalar(select(func.count()).where(Wish.book_id == book_id))

    return BookDetail(
        id=book.id,
        isbn=book.isbn,
        title=book.title,
        thumbnail=book.thumbnail,
        published_date=book.published_date,
        category=book.category,
        introduce=book.introduce,
        is_adult=book.is_adult,
        authors=book.authors,
        publishers=book.publishers,
        genres=book.genres,
        keywords=book.keywords,
        avg_rating=round(float(avg_rating), 2),
        count_rating=count_rating,
        wish_count=wish_count or 0,
    )
