from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./data/wc2026.db"
    football_api_key: str = ""
    admin_password: str = "changeme"
    frontend_url: str = "http://localhost:5173"
    form_url: str = ""  # Google Forms prediction URL, shown as "Tahmin Formu" button

    class Config:
        env_file = ".env"


settings = Settings()
