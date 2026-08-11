from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


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