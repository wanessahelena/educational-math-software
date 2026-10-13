from datetime import datetime

from sqlalchemy import Boolean, ForeignKey, Integer, String
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
    
    email_verificado: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false"
    )
    
    senha_hash: Mapped[str] = mapped_column(
        String(255),
        nullable = False
    )
    
    versao_token: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        server_default="0"
    )
    
    id_ano: Mapped[int] = mapped_column(
        ForeignKey("ano_escolar.id_ano"),
        nullable = False
    )
