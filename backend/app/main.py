from fastapi import FastAPI
from sqlalchemy import text

from app.database import engine


app = FastAPI(
    title="Educational Math Software API",
    description="API da ferramenta educacional de Matemática",
    version="0.1.0"
)


@app.get("/")
def root():
    return {
        "message": "Educational Math Software API",
        "status": "online"
    }


@app.get("/health/database")
def database_health():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "database": "connected"
        }

    except Exception as error:
        return {
            "database": "error",
            "message": str(error)
        }