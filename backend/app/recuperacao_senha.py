import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.token_recuperacao_senha import TokenRecuperacaoSenha


def calcular_hash_token_recuperacao(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def criar_token_recuperacao(db: Session, id_usuario: int) -> str:
    token = secrets.token_urlsafe(32)
    token_hash = calcular_hash_token_recuperacao(token)

    agora = datetime.now(timezone.utc).replace(tzinfo=None)
    expira_em = agora + timedelta(minutes=30)

    # Invalida tokens anteriores ainda não utilizados.
    db.query(TokenRecuperacaoSenha).filter(
        TokenRecuperacaoSenha.id_usuario == id_usuario,
        TokenRecuperacaoSenha.utilizado_em.is_(None)
    ).delete(synchronize_session=False)

    novo_token = TokenRecuperacaoSenha(
        id_usuario=id_usuario,
        token_hash=token_hash,
        expira_em=expira_em
    )

    db.add(novo_token)
    db.flush()

    return token