import html
import re
from datetime import date

import httpx

from app.core.config import settings

NAVER_BOOK_SEARCH_URL = "https://openapi.naver.com/v1/search/book.json"

_TAG_RE = re.compile(r"<[^>]+>")


def _clean(text: str) -> str:
    return html.unescape(_TAG_RE.sub("", text)).strip()


def _parse_pubdate(pubdate: str) -> date | None:
    if len(pubdate) != 8:
        return None
    try:
        return date(int(pubdate[:4]), int(pubdate[4:6]), int(pubdate[6:8]))
    except ValueError:
        return None


async def search_books(query: str, display: int = 20) -> list[dict]:
    async with httpx.AsyncClient() as client:
        res = await client.get(
            NAVER_BOOK_SEARCH_URL,
            params={"query": query, "display": display},
            headers={
                "X-Naver-Client-Id": settings.naver_client_id,
                "X-Naver-Client-Secret": settings.naver_client_secret,
            },
        )
        res.raise_for_status()
        items = res.json()["items"]

    books = []
    for item in items:
        isbn = item.get("isbn", "").replace(" ", "").replace("-", "")[-13:]
        books.append(
            {
                "title": _clean(item["title"]),
                "thumbnail": item["image"] or None,
                "introduce": _clean(item["description"]) if item["description"] else None,
                "authors": [a for a in re.split(r"[\^|]", _clean(item["author"])) if a],
                "publisher": _clean(item["publisher"]) if item["publisher"] else None,
                "isbn": isbn or None,
                "published_date": _parse_pubdate(item.get("pubdate", "")),
                "source_url": item["link"] or None,
            }
        )
    return books
