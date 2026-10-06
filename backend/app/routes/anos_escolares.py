from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.ano_escolar import AnoEscolar
from app.schemas.ano_escolar import AnoEscolarResponse
from app.schemas.conteudo import ConteudoResponse


router = APIRouter(
    prefix="/anos-escolares",
    tags=["Anos Escolares"]
)


@router.get(
    "/",
    response_model=list[AnoEscolarResponse]
)
def listar_anos_escolares(
    db: Session = Depends(get_db)
):
    return (
        db.query(AnoEscolar)
        .order_by(AnoEscolar.id_ano)
        .all()
    )


@router.get(
    "/{id_ano}/conteudos",
    response_model=list[ConteudoResponse]
)
def listar_conteudos_por_ano(
    id_ano: int,
    db: Session = Depends(get_db)
):
    ano = (
        db.query(AnoEscolar)
        .filter(AnoEscolar.id_ano == id_ano)
        .first()
    )

    if not ano:
        raise HTTPException(
            status_code=404,
            detail="Ano escolar não encontrado."
        )

    return ano.conteudos