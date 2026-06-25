"""네이버 책 검색 API로 테스트용 도서 데이터 시드. 실행: python -m app.seed_naver"""
import asyncio

from sqlalchemy import select

from app.core.db import SessionLocal
from app.models import Author, Book, Genre, Publisher
from app.services.naver_books import search_books

QUERIES = [
    ("소설", "novel"),
    ("자기계발", "self-help"),
    ("에세이", "essay"),
    ("경제", "economy"),
    ("인문", "humanities"),
    ("판타지 소설", "fantasy"),
    ("로맨스 소설", "romance"),
    ("역사", "history"),
    ("철학", "philosophy"),
    ("과학", "science"),
    ("심리학", "psychology"),
    ("건강", "health"),
    ("여행", "travel"),
    ("시", "poetry"),
    ("추리소설", "mystery"),
    ("SF소설", "sf"),
    ("요리", "cooking"),
    ("육아", "parenting"),
    ("경영", "business"),
]

TARGET_COUNT = 50


async def seed() -> None:
    async with SessionLocal() as db:
        existing_isbns = {isbn for (isbn,) in (await db.execute(select(Book.isbn))).all() if isbn}
        added = 0

        for keyword, category in QUERIES:
            if added >= TARGET_COUNT:
                break
            items = await search_books(keyword, display=20)
            for item in items:
                if added >= TARGET_COUNT:
                    break
                if not item["isbn"] or item["isbn"] in existing_isbns:
                    continue
                existing_isbns.add(item["isbn"])

                book = Book(
                    isbn=item["isbn"],
                    title=item["title"][:200],
                    thumbnail=item["thumbnail"][:500] if item["thumbnail"] else None,
                    published_date=item["published_date"],
                    category=category,
                    introduce=item["introduce"],
                    source_url=item["source_url"][:2083] if item["source_url"] else None,
                )
                book.authors = [Author(name=name[:100]) for name in item["authors"][:5]]
                if item["publisher"]:
                    book.publishers = [Publisher(name=item["publisher"][:100])]
                book.genres = [Genre(genre=keyword[:50])]
                db.add(book)
                added += 1

        await db.commit()
        print(f"{added}권의 책 데이터를 네이버 도서 검색 API에서 추가했습니다.")


if __name__ == "__main__":
    asyncio.run(seed())
