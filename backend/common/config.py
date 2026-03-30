try:
    from pydantic_settings import BaseSettings, SettingsConfigDict

    class Settings(BaseSettings):
        # Database
        DB_HOST: str = "localhost"
        DB_PORT: int = 3306
        DB_USER: str = "root"
        DB_PASSWORD: str = ""
        DB_NAME: str = "smart_scan"

        # CORS
        ALLOWED_ORIGIN: str = "http://localhost:3000"

        # Environment
        ENV: str = "development"
        LOG_LEVEL: str = "INFO"

        model_config = SettingsConfigDict(
            env_file=".env",
            case_sensitive=True,
        )
except ModuleNotFoundError:
    from pydantic.v1 import BaseSettings

    class Settings(BaseSettings):
        # Database
        DB_HOST: str = "localhost"
        DB_PORT: int = 3306
        DB_USER: str = "root"
        DB_PASSWORD: str = ""
        DB_NAME: str = "smart_scan"

        # CORS
        ALLOWED_ORIGIN: str = "http://localhost:3000"

        # Environment
        ENV: str = "development"
        LOG_LEVEL: str = "INFO"

        class Config:
            env_file = ".env"
            case_sensitive = True


settings = Settings()
