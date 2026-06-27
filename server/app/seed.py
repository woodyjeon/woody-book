"""개발용 샘플 데이터 시드 스크립트. 실행: python -m app.seed"""
import asyncio

from sqlalchemy import select

from app.core.db import SessionLocal
from app.core.security import hash_password
from app.models import Author, Book, Genre, Keyword, Member, Publisher
from app.models.member import Platform

SAMPLE_BOOKS = [
    {
        "title": "달빛 조각사",
        "category": "fantasy",
        "introduce": "가상현실 게임 속에서 펼쳐지는 모험을 그린 판타지 웹소설.",
        "thumbnail": "https://picsum.photos/seed/moonlight/300/420",
        "authors": ["남희성"],
        "publishers": ["로크미디어"],
        "genres": ["판타지"],
        "keywords": ["완결", "게임판타지"],
    },
    {
        "title": "전지적 독자 시점",
        "category": "fantasy",
        "introduce": "모든 시나리오를 알고 있는 유일한 독자가 펼치는 이야기.",
        "thumbnail": "https://picsum.photos/seed/omniscient/300/420",
        "authors": ["싱숑"],
        "publishers": ["문피아"],
        "genres": ["판타지", "현대판타지"],
        "keywords": ["완결", "회귀"],
    },
    {
        "title": "재혼 황후",
        "category": "romance",
        "introduce": "버려진 황후가 새로운 삶을 찾아가는 로맨스 판타지.",
        "thumbnail": "https://picsum.photos/seed/remarriage/300/420",
        "authors": ["알파타르트"],
        "publishers": ["디앤씨미디어"],
        "genres": ["로맨스판타지"],
        "keywords": ["완결", "황실"],
    },
    {
        "title": "여신강림",
        "category": "comic",
        "introduce": "화장으로 새 삶을 시작한 고등학생의 성장 만화.",
        "thumbnail": "https://picsum.photos/seed/truebeauty/300/420",
        "authors": ["야옹이"],
        "publishers": ["네이버웹툰"],
        "genres": ["순정", "학원"],
        "keywords": ["완결", "학원물"],
    },
    {
        "title": "신의 탑",
        "category": "comic",
        "introduce": "탑을 오르는 자들의 이야기를 그린 액션 판타지 만화.",
        "thumbnail": "https://picsum.photos/seed/towerofgod/300/420",
        "authors": ["SIU"],
        "publishers": ["네이버웹툰"],
        "genres": ["액션", "판타지"],
        "keywords": ["연재중", "탑"],
    },
]


async def seed() -> None:
    async with SessionLocal() as db:
        existing = await db.scalar(select(Book).limit(1))
        if existing is None:
            for data in SAMPLE_BOOKS:
                book = Book(
                    title=data["title"],
                    category=data["category"],
                    introduce=data["introduce"],
                    thumbnail=data["thumbnail"],
                )
                book.authors = [Author(name=name) for name in data["authors"]]
                book.publishers = [Publisher(name=name) for name in data["publishers"]]
                book.genres = [Genre(genre=g) for g in data["genres"]]
                book.keywords = [Keyword(keyword=k) for k in data["keywords"]]
                db.add(book)
            print(f"{len(SAMPLE_BOOKS)}권의 샘플 책 데이터를 추가했습니다.")
        else:
            print("책 데이터가 이미 존재해 건너뜁니다.")

        test_member = await db.scalar(select(Member).where(Member.user_id == "test_account1"))
        if test_member is None:
            db.add(
                Member(
                    user_id="test_account1",
                    password_hash=hash_password("test_account1"),
                    nickname="test_account1",
                    email="test_account1@example.com",
                    platform=Platform.local,
                )
            )
            print("테스트 계정(test_account1 / test_account1)을 추가했습니다.")
        else:
            print("테스트 계정이 이미 존재해 건너뜁니다.")

        await db.commit()


if __name__ == "__main__":
    asyncio.run(seed())
