from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.book import router as book_router
from app.api.comment import router as comment_router
from app.api.review import router as review_router
from app.api.wish import router as wish_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(book_router)
api_router.include_router(review_router)
api_router.include_router(comment_router)
api_router.include_router(wish_router)
