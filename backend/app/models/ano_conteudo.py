from sqlalchemy import Column, ForeignKey, Integer, Table

from app.database import Base


ano_conteudo = Table(
    "ano_conteudo",
    Base.metadata,
    Column(
        "id_ano",
        Integer,
        ForeignKey("ano_escolar.id_ano", ondelete="CASCADE"),
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