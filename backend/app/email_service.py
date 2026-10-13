import os
import smtplib
import ssl

from email.message import EmailMessage
from dotenv import load_dotenv


load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_APP_PASSWORD = os.getenv("SMTP_APP_PASSWORD")


def enviar_email_verificacao(destinatario: str, token: str):
    if not SMTP_EMAIL or not SMTP_APP_PASSWORD:
        raise ValueError("Configurações SMTP não definidas.")

    link = f"http://localhost:5173/verificar-email?token={token}"

    mensagem = EmailMessage()
    mensagem["Subject"] = "Confirme seu e-mail - Matelógica"
    mensagem["From"] = SMTP_EMAIL
    mensagem["To"] = destinatario

    mensagem.set_content(
        f"""Olá!

Recebemos um cadastro no Matelógica utilizando este endereço de e-mail.

Para confirmar seu e-mail, acesse o link abaixo:

{link}

Este link é válido por 30 minutos.

Se você não realizou esse cadastro, ignore esta mensagem.

Equipe Matelógica
"""
    )

    contexto = ssl.create_default_context()

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as servidor:
        servidor.starttls(context=contexto)
        servidor.login(SMTP_EMAIL, SMTP_APP_PASSWORD)
        servidor.send_message(mensagem)