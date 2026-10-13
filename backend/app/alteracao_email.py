import hashlib
import secrets

from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

from app.models.token_alteracao_email import TokenAlteracaoEmail


def calcular_hash_token_alteracao(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def criar_token_alteracao_email(
    db: Session,
    id_usuario: int,
    novo_email: str
) -> str:
    token = secrets.token_urlsafe(32)
    token_hash = calcular_hash_token_alteracao(token)

    agora = datetime.now(timezone.utc).replace(tzinfo=None)
    expira_em = agora + timedelta(minutes=30)

    # Invalida solicitações anteriores ainda pendentes.
    db.query(TokenAlteracaoEmail).filter(
        TokenAlteracaoEmail.id_usuario == id_usuario,
        TokenAlteracaoEmail.utilizado_em.is_(None)
    ).delete(synchronize_session=False)

    novo_registro = TokenAlteracaoEmail(
        id_usuario=id_usuario,
        novo_email=novo_email.strip().lower(),
        token_hash=token_hash,
        expira_em=expira_em
    )

    db.add(novo_registro)
    db.flush()

    return token