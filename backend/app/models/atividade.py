from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.atividade_conteudo import atividade_conteudo

if TYPE_CHECKING:
    from app.models.conteudo_matematico import ConteudoMatematico


class Atividade(Base):
    __tablename__ = "atividade"

    id_atividade: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    titulo: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    descricao: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    nivel: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    resposta_esperada: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    blocos_permitidos: Mapped[list[str]] = mapped_column(
        JSON,
        nullable=False,
        default=list
    )

    id_ano: Mapped[int] = mapped_column(
        ForeignKey("ano_escolar.id_ano"),
        nullable=False
    )

    conteudos: Mapped[list["ConteudoMatematico"]] = relationship(
        secondary=atividade_conteudo,
        back_populates="atividades"
    )