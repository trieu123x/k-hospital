from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Default Project Name"
    API_V1_STR: str = "/ai"
    GEMINI_API_KEY: str 
    DATABASE_URL: str

    class Config:
        env_file = ".env"

settings = Settings()