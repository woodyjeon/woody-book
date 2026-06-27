from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.db import get_db
from app.core.deps import get_current_member
from app.models import Book, Member, Wish
from app.schemas.wish import PaginatedWishes, WishedBook, WishStatus

router = APIRouter(tags=["wishes"])


@router.get("/books/{book_id}/wish", response_model=WishStatus)
async def get_wish_status(
    book_id: int,
    member: Member = Depends(get_current_member),
    db: AsyncSession = Depends(get_db),
) -> WishStatus:
    wish = await db.scalar(select(Wish).where(Wish.book_id == book_id, Wish.member_id == member.id))
    return WishStatus(is_wished=wish is not None)


@router.post("/books/{book_id}/wish", response_model=WishStatus, status_code=status.HTTP_201_CREATED)
async def add_wish(
    book_id: int,
    member: Member = Depends(get_current_member),
    db: AsyncSession = Depends(get_db),
) -> WishStatus:
    if await db.get(Book, book_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "책을 찾을 수 없습니다.")

    existing = await db.scalar(select(Wish).where(Wish.book_id == book_id, Wish.member_id == member.id))
    if existing is None:
        db.add(Wish(book_id=book_id, member_id=member.id))
        await db.commit()
    return WishStatus(is_wished=True)


@router.delete("/books/{book_id}/wish", status_code=status.HTTP_204_NO_CONTENT)
async def remove_wish(
    book_id: int,
    member: Member = Depends(get_current_member),
    db: AsyncSession = Depends(get_db),
) -> None:
    wish = await db.scalar(select(Wish).where(Wish.book_id == book_id, Wish.member_id == member.id))
    if wish is not None:
        await db.delete(wish)
        await db.commit()


@router.get("/wishes", response_model=PaginatedWishes)
async def list_my_wishes(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    member: Member = Depends(get_current_member),
    db: AsyncSession = Depends(get_db),
) -> PaginatedWishes:
    total = await db.scalar(select(func.count(Wish.id)).where(Wish.member_id == member.id))

    rows = (
        (
            await db.execute(
                select(Book)
                .join(Wish, Wish.book_id == Book.id)
                .where(Wish.member_id == member.id)
                .options(selectinload(Book.authors), selectinload(Book.genres))
                .order_by(Wish.created_at.desc())
                .offset((page - 1) * size)
                .limit(size)
            )
        )
        .scalars()
        .all()
    )

    return PaginatedWishes(
        items=[WishedBook.model_validate(book) for book in rows],
        page=page,
        size=size,
        total=total or 0,
    )
