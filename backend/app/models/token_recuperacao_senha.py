from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class TokenRecuperacaoSenha(Base):
    __tablename__ = "token_recuperacao_senha"

    id_token: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True
    )

    id_usuario: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("usuario.id_usuario", ondelete="CASCADE"),
        nullable=False
    )

    token_hash: Mapped[str] = mapped_column(
        String(64), unique=True, nullable=False
    )

    expira_em: Mapped[datetime] = mapped_column(
        DateTime, nullable=False
    )

    utilizado_em: Mapped[datetime | None] = mapped_column(
        DateTime, nullable=True
    )

    criado_em: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now()
    )