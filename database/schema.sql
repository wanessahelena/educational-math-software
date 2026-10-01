CREATE TABLE ano_escolar (
    id_ano SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);


CREATE TABLE usuario (
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


CREATE TABLE conteudo_matematico (
    id_conteudo SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT
);


CREATE TABLE atividade (
    id_atividade SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    nivel VARCHAR(50) NOT NULL,
    resposta_esperada VARCHAR(255),

    blocos_permitidos JSON NOT NULL
        DEFAULT '[]'::json,

    id_ano INTEGER NOT NULL,

    CONSTRAINT fk_atividade_ano
        FOREIGN KEY (id_ano)
        REFERENCES ano_escolar(id_ano)
);


CREATE TABLE atividade_conteudo (
    id_atividade INTEGER NOT NULL,
    id_conteudo INTEGER NOT NULL,

    PRIMARY KEY (
        id_atividade,
        id_conteudo
    ),

    CONSTRAINT fk_atividade_conteudo_atividade
        FOREIGN KEY (id_atividade)
        REFERENCES atividade(id_atividade)
        ON DELETE CASCADE,

    CONSTRAINT fk_atividade_conteudo_conteudo
        FOREIGN KEY (id_conteudo)
        REFERENCES conteudo_matematico(id_conteudo)
        ON DELETE CASCADE
);


CREATE TABLE tentativa (
    id_tentativa SERIAL PRIMARY KEY,
    data_tentativa TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    tempo_gasto INTEGER,
    resposta_aluno VARCHAR(255),
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


INSERT INTO ano_escolar (nome)
VALUES
    ('1º ano'),
    ('2º ano'),
    ('3º ano'),
    ('4º ano'),
    ('5º ano');


INSERT INTO conteudo_matematico (
    nome,
    descricao
)
VALUES
    (
        'Adição',
        'Operações e situações-problema envolvendo adição.'
    ),
    (
        'Subtração',
        'Operações e situações-problema envolvendo subtração.'
    ),
    (
        'Multiplicação',
        'Operações e situações-problema envolvendo multiplicação.'
    ),
    (
        'Divisão',
        'Operações e situações-problema envolvendo divisão.'
    ),
    (
        'Sequências e padrões',
        'Identificação e construção de sequências e padrões.'
    ),
    (
        'Frações',
        'Representação e operações envolvendo números fracionários.'
    ),
    (
        'Números decimais',
        'Representação e operações envolvendo números decimais.'
    ),
    (
        'Grandezas e medidas',
        'Atividades envolvendo medidas e suas unidades.'
    ),
    (
        'Geometria',
        'Atividades envolvendo formas, espaço e conceitos geométricos.'
    ),
    (
        'Tabelas e gráficos',
        'Leitura e interpretação de informações em tabelas e gráficos.'
    ),
    (
        'Porcentagem',
        'Noções iniciais e resolução de situações envolvendo porcentagem.'
    ),
    (
        'Educação financeira',
        'Situações envolvendo dinheiro e conceitos iniciais de educação financeira.'
    );