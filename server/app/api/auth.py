from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.db import get_db
from app.core.deps import get_current_member
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    hash_refresh_token,
    verify_password,
)
from app.models.member import Member, Platform
from app.schemas.auth import LoginRequest, MemberOut, RefreshRequest, RegisterRequest, TokenPair
from app.services.google_oauth import build_authorize_url, fetch_google_profile

router = APIRouter(prefix="/auth", tags=["auth"])


async def _issue_tokens(db: AsyncSession, member: Member) -> TokenPair:
    access_token = create_access_token(member.id, extra={"nickname": member.nickname})
    refresh_token = create_refresh_token(member.id)
    member.refresh_token_hash = hash_refresh_token(refresh_token)
    await db.commit()
    return TokenPair(access_token=access_token, refresh_token=refresh_token)


@router.post("/register", response_model=MemberOut, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)) -> Member:
    existing = await db.scalar(
        select(Member).where((Member.user_id == payload.user_id) | (Member.email == payload.email))
    )
    if existing is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "이미 사용 중인 아이디 또는 이메일입니다.")

    member = Member(
        user_id=payload.user_id,
        password_hash=hash_password(payload.password),
        nickname=payload.nickname,
        email=payload.email,
        gender=payload.gender,
        platform=Platform.local,
    )
    db.add(member)
    await db.commit()
    return member


@router.post("/login", response_model=TokenPair)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)) -> TokenPair:
    member = await db.scalar(
        select(Member).where(Member.user_id == payload.user_id, Member.platform == Platform.local)
    )
    if member is None or member.password_hash is None or not verify_password(payload.password, member.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "아이디 또는 비밀번호가 올바르지 않습니다.")

    return await _issue_tokens(db, member)


@router.post("/refresh", response_model=TokenPair)
async def refresh(payload: RefreshRequest, db: AsyncSession = Depends(get_db)) -> TokenPair:
    decoded = decode_token(payload.refresh_token)
    if decoded is None or decoded.get("type") != "refresh":
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "유효하지 않은 refresh token입니다.")

    member = await db.get(Member, int(decoded["sub"]))
    if member is None or member.refresh_token_hash != hash_refresh_token(payload.refresh_token):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "유효하지 않은 refresh token입니다.")

    return await _issue_tokens(db, member)


@router.get("/me", response_model=MemberOut)
async def me(member: Member = Depends(get_current_member)) -> Member:
    return member


@router.get("/google/login")
async def google_login() -> RedirectResponse:
    return RedirectResponse(build_authorize_url())


@router.get("/google/callback")
async def google_callback(code: str, db: AsyncSession = Depends(get_db)) -> RedirectResponse:
    profile = await fetch_google_profile(code)
    google_sub = profile["sub"]
    email = profile.get("email")

    member = await db.scalar(select(Member).where(Member.user_id == f"google_{google_sub}"))
    if member is None:
        member = Member(
            user_id=f"google_{google_sub}",
            nickname=profile.get("name", "woody-book 유저"),
            email=email,
            profile_image=profile.get("picture"),
            platform=Platform.google,
        )
        db.add(member)
        await db.commit()

    tokens = await _issue_tokens(db, member)
    redirect_url = (
        f"{settings.frontend_url}/oauth"
        f"?access_token={tokens.access_token}&refresh_token={tokens.refresh_token}"
    )
    return RedirectResponse(redirect_url)
