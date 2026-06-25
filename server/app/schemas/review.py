from datetime import datetime

from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    contents: str = Field(min_length=1, max_length=2000)
    rating: float = Field(ge=0, le=5)
    is_spoiler: bool = False


class ReviewOut(BaseModel):
    id: int
    member_id: int
    nickname: str
    contents: str | None
    rating: float | None
    is_spoiler: bool
    created_at: datetime
