from typing import TYPE_CHECKING

from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.ano_conteudo import ano_conteudo
from app.models.atividade_conteudo import atividade_conteudo

if TYPE_CHECKING:
    from app.models.ano_escolar import AnoEscolar
    from app.models.atividade import Atividade


class ConteudoMatematico(Base):
    __tablename__ = "conteudo_matematico"

    id_conteudo: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    nome: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True
    )

    descricao: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    atividades: Mapped[list["Atividade"]] = relationship(
        secondary=atividade_conteudo,
        back_populates="conteudos"
    )

    anos_escolares: Mapped[list["AnoEscolar"]] = relationship(
        secondary=ano_conteudo,
        back_populates="conteudos"
    )