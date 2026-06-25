from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.db import get_db
from app.core.deps import get_current_member
from app.models import Book, Comment, Member
from app.schemas.comment import CommentCreate, CommentOut

router = APIRouter(prefix="/books/{book_id}/comments", tags=["comments"])


@router.get("", response_model=list[CommentOut])
async def list_comments(book_id: int, db: AsyncSession = Depends(get_db)) -> list[CommentOut]:
    rows = (
        (
            await db.execute(
                select(Comment)
                .where(Comment.book_id == book_id)
                .options(selectinload(Comment.member))
                .order_by(Comment.created_at.desc())
            )
        )
        .scalars()
        .all()
    )
    return [
        CommentOut(id=c.id, member_id=c.member_id, nickname=c.member.nickname, contents=c.contents, created_at=c.created_at)
        for c in rows
    ]


@router.post("", response_model=CommentOut, status_code=status.HTTP_201_CREATED)
async def create_comment(
    book_id: int,
    payload: CommentCreate,
    member: Member = Depends(get_current_member),
    db: AsyncSession = Depends(get_db),
) -> CommentOut:
    if await db.get(Book, book_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "책을 찾을 수 없습니다.")

    comment = Comment(book_id=book_id, member_id=member.id, contents=payload.contents)
    db.add(comment)
    await db.commit()
    return CommentOut(
        id=comment.id, member_id=member.id, nickname=member.nickname, contents=comment.contents, created_at=comment.created_at
    )


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    book_id: int,
    comment_id: int,
    member: Member = Depends(get_current_member),
    db: AsyncSession = Depends(get_db),
) -> None:
    comment = await db.get(Comment, comment_id)
    if comment is None or comment.book_id != book_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "댓글을 찾을 수 없습니다.")
    if comment.member_id != member.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "본인 댓글만 삭제할 수 있습니다.")

    await db.delete(comment)
    await db.commit()
