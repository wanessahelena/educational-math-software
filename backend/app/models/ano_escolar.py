from typing import TYPE_CHECKING

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.ano_conteudo import ano_conteudo

if TYPE_CHECKING:
    from app.models.conteudo_matematico import ConteudoMatematico


class AnoEscolar(Base):
    __tablename__ = "ano_escolar"

    id_ano: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    nome: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    conteudos: Mapped[list["ConteudoMatematico"]] = relationship(
        secondary=ano_conteudo,
        back_populates="anos_escolares",
        order_by="ConteudoMatematico.id_conteudo"
    )