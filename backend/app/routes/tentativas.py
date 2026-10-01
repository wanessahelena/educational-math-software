from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import obter_usuario_atual
from app.database import get_db
from app.models.tentativa import Tentativa
from app.models.usuario import Usuario
from app.models.atividade import Atividade


router = APIRouter(
    prefix="/tentativas",
    tags=["Tentativas"]
)


@router.post("/")
def registrar_tentativa(
    id_usuario: int,
    id_atividade: int,
    resposta_aluno: str,
    tempo_gasto: int | None = None,
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    if usuario_atual.id_usuario != id_usuario:
        raise HTTPException(
            status_code=403,
            detail="Você não tem permissão para registrar esta tentativa."
        )

    atividade = (
        db.query(Atividade)
        .filter(Atividade.id_atividade == id_atividade)
        .first()
    )

    if not atividade:
        raise HTTPException(
            status_code=404,
            detail="Atividade não encontrada."
        )

    if resposta_aluno.strip() == atividade.resposta_esperada.strip():
        status = "correta"
    else:
        status = "incorreta"

    nova_tentativa = Tentativa(
        data_tentativa=datetime.now(),
        tempo_gasto=tempo_gasto,
        resposta_aluno=resposta_aluno,
        status=status,
        id_usuario=usuario_atual.id_usuario,
        id_atividade=id_atividade
    )

    db.add(nova_tentativa)
    db.commit()
    db.refresh(nova_tentativa)

    return nova_tentativa


@router.get("/usuario/{id_usuario}")
def listar_tentativas_usuario(
    id_usuario: int,
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    if usuario_atual.id_usuario != id_usuario:
        raise HTTPException(
            status_code=403,
            detail="Você não tem permissão para acessar estas tentativas."
        )

    tentativas = (
        db.query(Tentativa)
        .filter(Tentativa.id_usuario == usuario_atual.id_usuario)
        .order_by(Tentativa.data_tentativa.desc())
        .all()
    )

    return tentativas