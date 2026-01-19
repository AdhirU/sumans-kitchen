from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Server settings
    port: int = 3000
    environment: str = "development"

    # MongoDB settings
    mongodb_uri: str
    test_mongodb_uri: str | None = None
    database_name: str = "sumansKitchen"

    # OpenAI settings
    openai_api_key: str
    openai_model: str = "gpt-4o-mini"

    # JWT Authentication settings
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 365  # 1 year

    # Google OAuth settings
    google_client_id: str | None = None

    # CORS settings
    cors_origins: list[str] = ["http://localhost:5173"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    @property
    def effective_mongodb_uri(self) -> str:
        """Return test URI if in test mode, otherwise production URI."""
        if self.environment == "test" and self.test_mongodb_uri:
            return self.test_mongodb_uri
        return self.mongodb_uri


@lru_cache
def get_settings() -> Settings:
    return Settings()
