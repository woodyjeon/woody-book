from pydantic import BaseModel, EmailStr, Field

from app.models.member import Gender, Platform


class RegisterRequest(BaseModel):
    user_id: str = Field(min_length=5, max_length=20, pattern=r"^[a-z0-9_-]+$")
    password: str = Field(min_length=8, max_length=16)
    email: EmailStr
    nickname: str = Field(min_length=1, max_length=20)
    gender: Gender | None = None


class LoginRequest(BaseModel):
    user_id: str
    password: str


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class MemberOut(BaseModel):
    id: int
    user_id: str | None
    nickname: str
    email: str | None
    introduce: str | None
    gender: Gender | None
    platform: Platform
    profile_image: str | None
    is_public: bool

    model_config = {"from_attributes": True}
