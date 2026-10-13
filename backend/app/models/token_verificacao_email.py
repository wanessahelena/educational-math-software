from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class TokenVerificacaoEmail(Base):
    __tablename__ = "token_verificacao_email"

    id_token: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    id_usuario: Mapped[int] = mapped_column(
        ForeignKey("usuario.id_usuario", ondelete="CASCADE"),
        nullable=False
    )

    token_hash: Mapped[str] = mapped_column(
        String(64),
        nullable=False,
        unique=True
    )

    expira_em: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False
    )
    
    criado_em: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        server_default=func.now()
    )

    utilizado_em: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )