from fastapi import FastAPI
from sqlalchemy import text

from app.database import engine

from app.routes.anos_escolares import router as anos_escolares_router
from app.routes.atividades import router as atividades_router
from app.routes.usuarios import router as usuarios_router
from app.routes.tentativas import router as tentativas_router





app = FastAPI(
    title="Educational Math Software API",
    description="API da ferramenta educacional de Matemática",
    version="0.1.0"
)

app.include_router(anos_escolares_router)
app.include_router(atividades_router)
app.include_router(usuarios_router)
app.include_router(tentativas_router)

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