from datetime import datetime

from pydantic import BaseModel, Field


class CommentCreate(BaseModel):
    contents: str = Field(min_length=1, max_length=1000)


class CommentOut(BaseModel):
    id: int
    member_id: int
    nickname: str
    contents: str
    created_at: datetime
