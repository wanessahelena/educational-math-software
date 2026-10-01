from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.atividade import Atividade
from app.models.ano_escolar import AnoEscolar
from app.models.conteudo_matematico import ConteudoMatematico

from app.schemas.atividade import AtividadeResponse

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


@router.post("/")
def cadastrar_atividade(
    titulo: str,
    descricao: str,
    nivel: str,
    resposta_esperada: str,
    id_ano: int,
    blocos_permitidos: list[str] = Query(default=[]),
    ids_conteudos: list[int] = Query(default=[]),
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

    conteudos = []

    if ids_conteudos:
        conteudos = (
            db.query(ConteudoMatematico)
            .filter(
                ConteudoMatematico.id_conteudo.in_(
                    ids_conteudos
                )
            )
            .all()
        )

        ids_encontrados = {
            conteudo.id_conteudo
            for conteudo in conteudos
        }

        ids_inexistentes = (
            set(ids_conteudos) - ids_encontrados
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
        titulo=titulo,
        descricao=descricao,
        nivel=nivel,
        resposta_esperada=resposta_esperada,
        id_ano=id_ano,
        blocos_permitidos=blocos_permitidos
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