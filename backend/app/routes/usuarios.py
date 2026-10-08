
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.usuario import Usuario
from app.models.ano_escolar import AnoEscolar
from app.models.tentativa import Tentativa
from app.models.atividade import Atividade
from app.security import (
    gerar_hash_senha,
    verificar_senha,
    criar_token_acesso,
)

from app.auth import obter_usuario_atual


router = APIRouter(
    prefix="/usuarios",
    tags=["Usuários"]
)


class CadastroRequest(BaseModel):
    nome: str
    email: str
    senha: str
    id_ano: int

class AtualizarPerfilRequest(BaseModel):
    nome: str | None = None
    email: str | None = None
    id_ano: int | None = None

class LoginRequest(BaseModel):
    email: str
    senha: str


def dados_publicos_usuario(usuario: Usuario, db: Session):
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


@router.post("/")
def cadastrar_usuario(
    dados: CadastroRequest,
    db: Session = Depends(get_db)
):
    ano_escolar = (
        db.query(AnoEscolar)
        .filter(AnoEscolar.id_ano == dados.id_ano)
        .first()
    )

    if not ano_escolar:
        raise HTTPException(
            status_code=404,
            detail="Ano escolar não encontrado."
        )

    usuario_existente = (
        db.query(Usuario)
        .filter(Usuario.email == dados.email)
        .first()
    )

    if usuario_existente:
        raise HTTPException(
            status_code=409,
            detail="E-mail já cadastrado."
        )

    novo_usuario = Usuario(
        nome=dados.nome,
        email=dados.email,
        senha_hash=gerar_hash_senha(dados.senha),
        id_ano=dados.id_ano
    )

    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    return dados_publicos_usuario(novo_usuario, db)


@router.post("/login")
def login(
    dados: LoginRequest,
    db: Session = Depends(get_db)
):
    usuario = (
        db.query(Usuario)
        .filter(Usuario.email == dados.email)
        .first()
    )

    if not usuario or not verificar_senha(
        dados.senha,
        usuario.senha_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="E-mail ou senha incorretos."
        )

    token = criar_token_acesso(usuario.id_usuario)

    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": dados_publicos_usuario(usuario, db)
    }


@router.get("/{id_usuario}/progresso")
def consultar_progresso(
    id_usuario: int,
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    if usuario_atual.id_usuario != id_usuario:
        raise HTTPException(
            status_code=403,
            detail="Você não tem permissão para acessar estes dados."
        )
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
        db.query(Tentativa)
        .join(
            Atividade,
            Tentativa.id_atividade == Atividade.id_atividade
        )
        .filter(
            Tentativa.id_usuario == id_usuario,
            Atividade.id_ano == usuario.id_ano
        )
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


@router.get("/{id_usuario}/progresso/resumo")
def consultar_resumo_progresso(
    id_usuario: int,
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    if usuario_atual.id_usuario != id_usuario:
        raise HTTPException(
            status_code=403,
            detail="Você não tem permissão para acessar estes dados."
        )
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
        db.query(Tentativa)
        .join(
            Atividade,
            Tentativa.id_atividade == Atividade.id_atividade
        )
        .filter(
            Tentativa.id_usuario == id_usuario,
            Atividade.id_ano == usuario.id_ano
        )
        .all()
    )

    total_tentativas = len(tentativas)

    atividades_realizadas = len(
        {tentativa.id_atividade for tentativa in tentativas}
    )

    total_atividades = (
        db.query(Atividade)
        .filter(Atividade.id_ano == usuario.id_ano)
        .count()
    )

    percentual_conclusao = (
        (atividades_realizadas / total_atividades) * 100
        if total_atividades > 0
        else 0
    )

    total_corretas = sum(
        1 for tentativa in tentativas
        if tentativa.status == "correta"
    )

    total_incorretas = sum(
        1 for tentativa in tentativas
        if tentativa.status == "incorreta"
    )

    percentual_acerto = (
        (total_corretas / total_tentativas) * 100
        if total_tentativas > 0
        else 0
    )

    return {
        "id_usuario": usuario.id_usuario,
        "total_tentativas": total_tentativas,
        "atividades_realizadas": atividades_realizadas,
        "total_atividades": total_atividades,
        "percentual_conclusao": round(percentual_conclusao, 2),
        "total_corretas": total_corretas,
        "total_incorretas": total_incorretas,
        "percentual_acerto": round(percentual_acerto, 2)
    }


@router.get("/{id_usuario}/progresso/atividades")
def consultar_desempenho_atividades(
    id_usuario: int,
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    if usuario_atual.id_usuario != id_usuario:
        raise HTTPException(
            status_code=403,
            detail="Você não tem permissão para acessar estes dados."
        )
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
        .filter(
            Tentativa.id_usuario == id_usuario,
            Atividade.id_ano == usuario.id_ano
        )
        .all()
    )

    desempenho = {}

    for tentativa, atividade in tentativas:
        if atividade.id_atividade not in desempenho:
            desempenho[atividade.id_atividade] = {
                "id_atividade": atividade.id_atividade,
                "titulo": atividade.titulo,
                "total_tentativas": 0,
                "total_corretas": 0,
                "total_incorretas": 0
            }

        item = desempenho[atividade.id_atividade]
        item["total_tentativas"] += 1

        if tentativa.status == "correta":
            item["total_corretas"] += 1
        elif tentativa.status == "incorreta":
            item["total_incorretas"] += 1

    return list(desempenho.values())


@router.get("/{id_usuario}")
def buscar_usuario(
    id_usuario: int,
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    if usuario_atual.id_usuario != id_usuario:
        raise HTTPException(
            status_code=403,
            detail="Você não tem permissão para acessar estes dados."
        )

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

    return dados_publicos_usuario(usuario, db)


@router.patch("/{id_usuario}")
def atualizar_perfil(
    id_usuario: int,
    dados: AtualizarPerfilRequest,
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    if usuario_atual.id_usuario != id_usuario:
        raise HTTPException(
            status_code=403,
            detail="Você não tem permissão para alterar este perfil."
        )

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

    if dados.nome is not None:
        nome = dados.nome.strip()

        if not nome:
            raise HTTPException(
                status_code=422,
                detail="O nome não pode estar vazio."
            )

        usuario.nome = nome

    if dados.email is not None:
        email = dados.email.strip()

        if not email:
            raise HTTPException(
                status_code=422,
                detail="O e-mail não pode estar vazio."
            )

        email_existente = (
            db.query(Usuario)
            .filter(
                Usuario.email == email,
                Usuario.id_usuario != id_usuario
            )
            .first()
        )

        if email_existente:
            raise HTTPException(
                status_code=409,
                detail="Este e-mail já está cadastrado."
            )

        usuario.email = email

    if dados.id_ano is not None:
        ano_escolar = (
            db.query(AnoEscolar)
            .filter(AnoEscolar.id_ano == dados.id_ano)
            .first()
        )

        if not ano_escolar:
            raise HTTPException(
                status_code=404,
                detail="Ano escolar não encontrado."
            )

        usuario.id_ano = dados.id_ano

    db.commit()
    db.refresh(usuario)

    return dados_publicos_usuario(usuario, db)