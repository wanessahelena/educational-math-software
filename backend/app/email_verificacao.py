import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.token_verificacao_email import TokenVerificacaoEmail


def gerar_token_verificacao():
    token = secrets.token_urlsafe(32)

    token_hash = hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()

    expira_em = datetime.now(timezone.utc).replace(
        tzinfo=None
    ) + timedelta(minutes=30)

    return token, token_hash, expira_em


def calcular_hash_token(token: str) -> str:
    return hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()
    
def criar_token_verificacao(db: Session, id_usuario: int) -> str:
    token, token_hash, expira_em = gerar_token_verificacao()

    #INVALIDA TOKENS ANTERIORES AINDA NAO UTILIZADOS
    db.query(TokenVerificacaoEmail).filter(
        TokenVerificacaoEmail.id_usuario == id_usuario,
        TokenVerificacaoEmail.utilizado_em.is_(None)
    ).delete(synchronize_session=False)

    novo_token = TokenVerificacaoEmail(
        id_usuario=id_usuario,
        token_hash=token_hash,
        expira_em=expira_em
    )

    db.add(novo_token)
    db.flush()

    return token

def pode_reenviar_verificacao(db: Session, id_usuario: int) -> bool:
    ultimo_token = (
        db.query(TokenVerificacaoEmail)
        .filter(
            TokenVerificacaoEmail.id_usuario == id_usuario,
            TokenVerificacaoEmail.utilizado_em.is_(None)
        )
        .order_by(TokenVerificacaoEmail.criado_em.desc())
        .first()
    )

    if ultimo_token is None:
        return True

    agora = datetime.now(timezone.utc).replace(tzinfo=None)

    return agora - ultimo_token.criado_em >= timedelta(seconds=60)