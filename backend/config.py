from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    cohere_key: str

    class Config:
        env_file = ".env"  # Tells Pydantic to load environment variables from this file

settings = Settings()
