from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.conteudo_matematico import ConteudoMatematico


router = APIRouter(
    prefix="/conteudos",
    tags=["Conteúdos Matemáticos"]
)


@router.get("/")
def listar_conteudos(
    db: Session = Depends(get_db)
):
    return (
        db.query(ConteudoMatematico)
        .order_by(ConteudoMatematico.id_conteudo)
        .all()
    )


@router.get("/{id_conteudo}")
def buscar_conteudo(
    id_conteudo: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(ConteudoMatematico)
        .filter(
            ConteudoMatematico.id_conteudo == id_conteudo
        )
        .first()
    )