from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.usuario import Usuario
from app.models.ano_escolar import AnoEscolar
from app.models.tentativa import Tentativa
from app.models.atividade import Atividade


router = APIRouter(
    prefix="/usuarios",
    tags=["Usuários"]
)


@router.post("/")
def cadastrar_usuario(
    nome: str,
    email: str,
    senha_hash: str,
    id_ano: int,
    db: Session = Depends(get_db)
):
    ano_escolar = (
        db.query(AnoEscolar)
        .filter(AnoEscolar.id_ano == id_ano)
        .first()
    )

    if not ano_escolar:
        raise HTTPException(
            status_code=404,
            detail="Ano escolar não encontrado."
        )

    usuario_existente = (
        db.query(Usuario)
        .filter(Usuario.email == email)
        .first()
    )

    if usuario_existente:
        raise HTTPException(
            status_code=409,
            detail="E-mail já cadastrado."
        )

    novo_usuario = Usuario(
        nome=nome,
        email=email,
        senha_hash=senha_hash,
        id_ano=id_ano
    )

    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    return novo_usuario

@router.get("/{id_usuario}/progresso")
def consultar_progresso(
    id_usuario: int,
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

    tentativas = (
        db.query(Tentativa, Atividade)
        .join(
            Atividade,
            Tentativa.id_atividade == Atividade.id_atividade
        )
        .filter(Tentativa.id_usuario == id_usuario)
        .order_by(Tentativa.data_tentativa.desc())
        .all()
    )

    return [
        {
            "id_tentativa": tentativa.id_tentativa,
            "id_atividade": atividade.id_atividade,
            "titulo_atividade": atividade.titulo,
            "data_tentativa": tentativa.data_tentativa,
            "tempo_gasto": tentativa.tempo_gasto,
            "resposta_aluno": tentativa.resposta_aluno,
            "status": tentativa.status
        }
        for tentativa, atividade in tentativas
    ]

@router.get("/{id_usuario}")
def buscar_usuario(
    id_usuario: int,
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

    ano_escolar = (
        db.query(AnoEscolar)
        .filter(AnoEscolar.id_ano == usuario.id_ano)
        .first()
    )

    return {
        "id_usuario": usuario.id_usuario,
        "nome": usuario.nome,
        "email": usuario.email,
        "id_ano": usuario.id_ano,
        "ano_escolar": ano_escolar.nome if ano_escolar else None
    }
