from fastapi import FastAPI

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