from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.atividade import Atividade
from app.models.ano_escolar import AnoEscolar
from app.models.conteudo_matematico import ConteudoMatematico

from app.schemas.atividade import AtividadeCreate, AtividadeResponse

router = APIRouter(
    prefix="/atividades",
    tags=["Atividades"]
)


@router.get(
    "/",
    response_model=list[AtividadeResponse]
)

def listar_atividades(db: Session = Depends(get_db)):
    return (
        db.query(Atividade)
        .order_by(Atividade.id_atividade)
        .all()
    )


@router.get(
    "/ano/{id_ano}",
    response_model=list[AtividadeResponse]
)

def listar_atividades_por_ano(
    id_ano: int,
    db: Session = Depends(get_db)
):
    atividades = (
        db.query(Atividade)
        .filter(Atividade.id_ano == id_ano)
        .order_by(Atividade.id_atividade)
        .all()
    )

    if not atividades:
        raise HTTPException(
            status_code=404,
            detail="Nenhuma atividade encontrada para este ano escolar."
        )

    return atividades


@router.post(
    "/",
    response_model=AtividadeResponse,
    status_code=201
)
def cadastrar_atividade(
    dados: AtividadeCreate,
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

    conteudos = []

    if dados.ids_conteudos:
        conteudos = (
            db.query(ConteudoMatematico)
            .filter(
                ConteudoMatematico.id_conteudo.in_(
                    dados.ids_conteudos
                )
            )
            .all()
        )

        ids_encontrados = {
            conteudo.id_conteudo
            for conteudo in conteudos
        }

        ids_inexistentes = (
            set(dados.ids_conteudos)
            - ids_encontrados
        )

        if ids_inexistentes:
            raise HTTPException(
                status_code=404,
                detail=(
                    "Conteúdo(s) matemático(s) "
                    f"não encontrado(s): "
                    f"{sorted(ids_inexistentes)}"
                )
            )

    nova_atividade = Atividade(
        titulo=dados.titulo,
        descricao=dados.descricao,
        nivel=dados.nivel,
        resposta_esperada=dados.resposta_esperada,
        id_ano=dados.id_ano,
        blocos_permitidos=dados.blocos_permitidos
    )

    nova_atividade.conteudos = conteudos

    db.add(nova_atividade)
    db.commit()
    db.refresh(nova_atividade)

    return nova_atividade


@router.get(
    "/{id_atividade}",
    response_model=AtividadeResponse
)

def buscar_atividade(
    id_atividade: int,
    db: Session = Depends(get_db)
):
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

    return atividade