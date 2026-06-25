"""테스트용 리뷰/댓글 시드. 실행: python -m app.seed_community"""
import asyncio
import random

from sqlalchemy import select

from app.core.db import SessionLocal
from app.core.security import hash_password
from app.models import Book, Comment, Member, Review
from app.models.member import Platform

REVIEWERS = [
    ("reader_yuna", "유나", "yuna.reader@example.com"),
    ("book_minho", "민호", "minho.book@example.com"),
    ("daily_reading", "소피아", "sophia.read@example.com"),
    ("jiwoo_books", "지우", "jiwoo.books@example.com"),
    ("haeun_log", "하은", "haeun.log@example.com"),
]

REVIEW_TEMPLATES = [
    ("정말 인상 깊게 읽었습니다. 술술 읽히고 여운이 오래 남네요.", 5.0),
    ("문장이 좋아서 천천히 음미하며 읽었어요. 주변에 추천하고 싶습니다.", 4.5),
    ("초반은 다소 지루했지만 후반부로 갈수록 몰입도가 높아졌어요.", 4.0),
    ("제목만큼 강렬한 내용은 아니었지만 무난하게 읽기 좋았습니다.", 3.5),
    ("올해 읽은 책 중 가장 좋았어요. 강력 추천합니다!", 5.0),
    ("기대만큼은 아니었어요. 전개가 다소 늘어지는 느낌이었습니다.", 2.5),
    ("작가의 시선이 신선하고 통찰력이 느껴지는 책이었습니다.", 4.5),
    ("가볍게 읽기 좋아서 출퇴근길에 추천해요.", 4.0),
    ("내용이 알차고 실용적인 조언이 많아서 도움이 됐어요.", 4.5),
    ("기대했던 것보다는 평범했어요. 그래도 끝까지 읽게 되는 매력은 있습니다.", 3.0),
]

COMMENT_TEMPLATES = [
    "표지 디자인이 너무 예뻐요",
    "이 책 사야겠다",
    "저도 읽어봤는데 좋았어요!",
    "줄거리 궁금하네요",
    "추천 감사합니다",
    "오 이거 베스트셀러였죠",
    "전자책으로도 있나요?",
    "장바구니에 담았습니다",
]


async def seed() -> None:
    async with SessionLocal() as db:
        members = []
        for user_id, nickname, email in REVIEWERS:
            member = await db.scalar(select(Member).where(Member.user_id == user_id))
            if member is None:
                member = Member(
                    user_id=user_id,
                    password_hash=hash_password("reader!1234"),
                    nickname=nickname,
                    email=email,
                    platform=Platform.local,
                )
                db.add(member)
                await db.flush()
            members.append(member)

        book_ids = (await db.execute(select(Book.id))).scalars().all()
        sample_books = random.sample(book_ids, k=min(30, len(book_ids)))

        review_count = 0
        comment_count = 0
        for book_id in sample_books:
            for member in random.sample(members, k=random.randint(1, 2)):
                existing = await db.scalar(
                    select(Review).where(Review.book_id == book_id, Review.member_id == member.id)
                )
                if existing is not None:
                    continue
                text, rating = random.choice(REVIEW_TEMPLATES)
                db.add(Review(book_id=book_id, member_id=member.id, contents=text, rating=rating))
                review_count += 1

            for member in random.sample(members, k=random.randint(0, 2)):
                db.add(Comment(book_id=book_id, member_id=member.id, contents=random.choice(COMMENT_TEMPLATES)))
                comment_count += 1

        await db.commit()
        print(f"리뷰 {review_count}개, 댓글 {comment_count}개를 추가했습니다.")


if __name__ == "__main__":
    asyncio.run(seed())
