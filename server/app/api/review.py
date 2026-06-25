from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.db import get_db
from app.core.deps import get_current_member
from app.models import Book, Member, Review
from app.schemas.review import ReviewCreate, ReviewOut

router = APIRouter(prefix="/books/{book_id}/reviews", tags=["reviews"])


@router.get("", response_model=list[ReviewOut])
async def list_reviews(book_id: int, db: AsyncSession = Depends(get_db)) -> list[ReviewOut]:
    rows = (
        (
            await db.execute(
                select(Review)
                .where(Review.book_id == book_id)
                .options(selectinload(Review.member))
                .order_by(Review.created_at.desc())
            )
        )
        .scalars()
        .all()
    )
    return [
        ReviewOut(
            id=r.id,
            member_id=r.member_id,
            nickname=r.member.nickname,
            contents=r.contents,
            rating=r.rating,
            is_spoiler=r.is_spoiler,
            created_at=r.created_at,
        )
        for r in rows
    ]


@router.post("", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
async def create_review(
    book_id: int,
    payload: ReviewCreate,
    member: Member = Depends(get_current_member),
    db: AsyncSession = Depends(get_db),
) -> ReviewOut:
    if await db.get(Book, book_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "책을 찾을 수 없습니다.")

    existing = await db.scalar(select(Review).where(Review.book_id == book_id, Review.member_id == member.id))
    if existing is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "이미 이 책에 리뷰를 작성했습니다.")

    review = Review(
        book_id=book_id,
        member_id=member.id,
        contents=payload.contents,
        rating=payload.rating,
        is_spoiler=payload.is_spoiler,
    )
    db.add(review)
    await db.commit()
    return ReviewOut(
        id=review.id,
        member_id=member.id,
        nickname=member.nickname,
        contents=review.contents,
        rating=review.rating,
        is_spoiler=review.is_spoiler,
        created_at=review.created_at,
    )


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(
    book_id: int,
    review_id: int,
    member: Member = Depends(get_current_member),
    db: AsyncSession = Depends(get_db),
) -> None:
    review = await db.get(Review, review_id)
    if review is None or review.book_id != book_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "리뷰를 찾을 수 없습니다.")
    if review.member_id != member.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "본인 리뷰만 삭제할 수 있습니다.")

    await db.delete(review)
    await db.commit()
