from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # App
    APP_NAME: str = "DevPulse API"
    DEBUG: bool = False
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://devpulse:devpulse@localhost:5432/devpulse"

    # GitHub
    GITHUB_TOKEN: str = ""
    GITHUB_API_BASE: str = "https://api.github.com"

    # Cache
    REDIS_URL: str = "redis://localhost:6379"
    CACHE_TTL_SECONDS: int = 3600  # 1 hour


settings = Settings()
