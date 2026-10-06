from sqlalchemy import Column, ForeignKey, Integer, Table

from app.database import Base


atividade_conteudo = Table(
    "atividade_conteudo",
    Base.metadata,

    Column(
        "id_atividade",
        Integer,
        ForeignKey(
            "atividade.id_atividade",
            ondelete="CASCADE"
        ),
        primary_key=True
    ),

    Column(
        "id_conteudo",
        Integer,
        ForeignKey(
            "conteudo_matematico.id_conteudo",
            ondelete="CASCADE"
        ),
        primary_key=True
    ),
)