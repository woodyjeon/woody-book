from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str

    @field_validator("database_url")
    @classmethod
    def _ensure_asyncpg_driver(cls, value: str) -> str:
        # Render/Heroku 등 매니지드 Postgres는 postgres(ql):// 형태로만 URL을 제공한다.
        if value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql+asyncpg://", 1)
        if value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+asyncpg://", 1)
        return value

    jwt_secret: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 7

    google_client_id: str = ""
    google_client_secret: str = ""
    google_redirect_uri: str = ""

    naver_client_id: str = ""
    naver_client_secret: str = ""

    frontend_url: str = "http://localhost:5173"
    cors_origins: str = "http://localhost:5173"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def sync_database_url(self) -> str:
        return self.database_url.replace("postgresql+asyncpg://", "postgresql+psycopg2://")


settings = Settings()
