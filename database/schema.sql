CREATE TABLE ano_escolar(
    id_ano SERIAL PRIMARy KEY,
    nome VARCHAR(50) NOT NULL
);

CREATE TABLE usuario(
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_ano INTEGER NOT NULL,

    CONSTRAINT fk_usuario_ano
        FOREIGN KEY (id_ano)
        REFERENCES ano_escolar(id_ano)
);

CREATE TABLE atividade (
    id_atividade SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    nivel VARCHAR(50) NOT NULL,
    id_ano INTEGER NOT NULL,

    CONSTRAINT fk_atividade_ano
        FOREIGN KEY (id_ano)
        REFERENCES ano_escolar(id_ano)
);

CREATE TABLE tentativa (
    id_tentativa SERIAL PRIMARY KEY,
    data_tentativa TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tempo_gasto INTEGER,
    status VARCHAR(30) NOT NULL,
    id_usuario INTEGER NOT NULL,
    id_atividade INTEGER NOT NULL,

    CONSTRAINT fk_tentativa_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario),

    CONSTRAINT fk_tentativa_atividade
        FOREIGN KEY (id_atividade)
        REFERENCES atividade(id_atividade)
);