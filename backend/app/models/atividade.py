from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


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

    id_ano: Mapped[int] = mapped_column(
        ForeignKey("ano_escolar.id_ano"),
        nullable=False
    )