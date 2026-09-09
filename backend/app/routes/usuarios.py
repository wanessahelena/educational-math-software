from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.usuario import Usuario
from app.models.ano_escolar import AnoEscolar


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

    return {
    "id_usuario": usuario.id_usuario,
    "nome": usuario.nome,
    "email": usuario.email,
    "id_ano": usuario.id_ano
}
