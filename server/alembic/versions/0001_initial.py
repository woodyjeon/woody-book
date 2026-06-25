"""initial schema

Revision ID: 0001
Revises:
Create Date: 2026-06-25

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

gender_enum = sa.Enum("F", "M", name="gender")
platform_enum = sa.Enum("local", "google", name="platform")


def upgrade() -> None:
    op.create_table(
        "member",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.String(50), unique=True),
        sa.Column("password_hash", sa.String(255)),
        sa.Column("nickname", sa.String(20), nullable=False),
        sa.Column("email", sa.String(120), unique=True),
        sa.Column("introduce", sa.String(240)),
        sa.Column("birth_year", sa.Date()),
        sa.Column("gender", gender_enum),
        sa.Column("platform", platform_enum, nullable=False, server_default="local"),
        sa.Column("profile_image", sa.String(500)),
        sa.Column("refresh_token_hash", sa.String(255)),
        sa.Column("is_public", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "book",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("isbn", sa.String(13)),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("thumbnail", sa.String(500)),
        sa.Column("published_date", sa.Date()),
        sa.Column("category", sa.String(20)),
        sa.Column("introduce", sa.Text()),
        sa.Column("is_adult", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("source_url", sa.String(2083)),
    )

    op.create_table(
        "author",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("book_id", sa.Integer(), sa.ForeignKey("book.id"), nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
    )

    op.create_table(
        "publisher",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("book_id", sa.Integer(), sa.ForeignKey("book.id"), nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
    )

    op.create_table(
        "genre",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("book_id", sa.Integer(), sa.ForeignKey("book.id"), nullable=False),
        sa.Column("genre", sa.String(50), nullable=False),
    )

    op.create_table(
        "keyword",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("book_id", sa.Integer(), sa.ForeignKey("book.id"), nullable=False),
        sa.Column("keyword", sa.String(50), nullable=False),
    )

    op.create_table(
        "review",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("book_id", sa.Integer(), sa.ForeignKey("book.id"), nullable=False),
        sa.Column("member_id", sa.Integer(), sa.ForeignKey("member.id"), nullable=False),
        sa.Column("contents", sa.Text()),
        sa.Column("rating", sa.Float()),
        sa.Column("is_spoiler", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint("book_id", "member_id", name="uq_review_book_member"),
    )

    op.create_table(
        "wish",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("book_id", sa.Integer(), sa.ForeignKey("book.id"), nullable=False),
        sa.Column("member_id", sa.Integer(), sa.ForeignKey("member.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint("book_id", "member_id", name="uq_wish_book_member"),
    )


def downgrade() -> None:
    op.drop_table("wish")
    op.drop_table("review")
    op.drop_table("keyword")
    op.drop_table("genre")
    op.drop_table("publisher")
    op.drop_table("author")
    op.drop_table("book")
    op.drop_table("member")
