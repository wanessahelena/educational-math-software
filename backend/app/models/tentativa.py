from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Tentativa(Base):
    __tablename__ = "tentativa"

    id_tentativa: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    data_tentativa: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False
    )

    tempo_gasto: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    resposta_aluno: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False
    )

    id_usuario: Mapped[int] = mapped_column(
        ForeignKey("usuario.id_usuario"),
        nullable=False
    )

    id_atividade: Mapped[int] = mapped_column(
        ForeignKey("atividade.id_atividade"),
        nullable=False
    )