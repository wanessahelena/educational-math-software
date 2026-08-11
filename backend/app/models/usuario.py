from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Usuario(Base):
    __tablename__ = "usuario"
    
    id_usuario: Mapped[int] = mapped_column(
        Integer,
        primary_key = True
    )
    
    nome: Mapped[str] = mapped_column(
        String(150),
        nullable = False
    )
    
    email: Mapped[str] = mapped_column(
        String(150),
        nullable = False
    )
    
    senha_hash: Mapped[str] = mapped_column(
        String(255),
        nullable = False
    )
    
    id_ano: Mapped[int] = mapped_column(
        ForeignKey("ano_escolar.id_ano"),
        nullable = False
    )
