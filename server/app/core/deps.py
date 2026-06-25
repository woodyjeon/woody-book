from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.security import decode_token
from app.models import Member

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_member(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> Member:
    if credentials is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "인증이 필요합니다.")

    payload = decode_token(credentials.credentials)
    if payload is None or payload.get("type") != "access":
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "유효하지 않은 토큰입니다.")

    member = await db.get(Member, int(payload["sub"]))
    if member is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "사용자를 찾을 수 없습니다.")

    return member
