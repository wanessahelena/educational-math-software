CREATE TABLE IF NOT EXISTS token_recuperacao_senha (
    id_token SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL
        REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expira_em TIMESTAMP NOT NULL,
    utilizado_em TIMESTAMP NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);