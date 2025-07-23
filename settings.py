# In your settings.py file

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # <-- ADD THIS LINE
    UPLOAD_DIR: str = "uploads"
    OUTPUT_DIR: str = "output"

    class Config:
        # This tells Pydantic to load variables from a .env file if it exists
        env_file = ".env"

settings = Settings()