from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

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
    db: Session = Depends(get_db)
):
    usuario = (
        db.query(Usuario)
        .filter(Usuario.id_usuario == id_usuario)
        .first()
    )

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuário não encontrado."
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
        id_usuario=id_usuario,
        id_atividade=id_atividade
    )

    db.add(nova_tentativa)
    db.commit()
    db.refresh(nova_tentativa)

    return nova_tentativa