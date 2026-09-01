from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.atividade import Atividade


router = APIRouter(
    prefix="/atividades",
    tags=["Atividades"]
)


@router.get("/")
def listar_atividades(db: Session = Depends(get_db)):
    return (
        db.query(Atividade)
        .order_by(Atividade.id_atividade)
        .all()
    )


@router.get("/ano/{id_ano}")
def listar_atividades_por_ano(
    id_ano: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(Atividade)
        .filter(Atividade.id_ano == id_ano)
        .order_by(Atividade.id_atividade)
        .all()
    )


@router.get("/{id_atividade}")
def buscar_atividade(
    id_atividade: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(Atividade)
        .filter(Atividade.id_atividade == id_atividade)
        .first()
    )


@router.post("/")
def cadastrar_atividade(
    titulo: str,
    descricao: str,
    nivel: str,
    resposta_esperada: str,
    id_ano: int,
    db: Session = Depends(get_db)
):
    nova_atividade = Atividade(
        titulo=titulo,
        descricao=descricao,
        nivel=nivel,
        resposta_esperada=resposta_esperada,
        id_ano=id_ano
    )

    db.add(nova_atividade)
    db.commit()
    db.refresh(nova_atividade)

    return nova_atividade