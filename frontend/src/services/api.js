const API_URL = "http://127.0.0.1:8000";

function obterCabecalhoAutenticacao() {
    const token = localStorage.getItem("token");

    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
}

function verificarSessaoExpirada(resposta) {
    if (resposta.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        window.dispatchEvent(new Event("sessao-expirada"));

        throw new Error(
            "Sua sessão expirou. Faça login novamente."
        );
    }
}

export async function buscarAnosEscolares() {
    const resposta = await fetch(`${API_URL}/anos-escolares/`);

    if (!resposta.ok) {
        throw new Error("Erro ao buscar anos escolares.");
    }

    return await resposta.json();
    }


export async function cadastrarUsuario(nome, email, senha, idAno) {
    const resposta = await fetch(`${API_URL}/usuarios/`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        nome,
        email,
        senha,
        id_ano: Number(idAno),
        }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.detail || "Erro ao cadastrar usuário.");
    }

    return dados;
}

export async function buscarAtividadesPorAno(idAno) {
    const resposta = await fetch(
        `${API_URL}/atividades/ano/${idAno}`
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(
        dados.detail || "Erro ao buscar atividades."
        );
    }

    return dados;
}

export async function registrarTentativa(
    idUsuario,
    idAtividade,
    respostaAluno,
    tempoGasto
) {
    const parametros = new URLSearchParams({
        id_usuario: idUsuario,
        id_atividade: idAtividade,
        resposta_aluno: respostaAluno,
    });

    if (tempoGasto !== null && tempoGasto !== undefined) {
        parametros.append("tempo_gasto", tempoGasto);
    }

    const resposta = await fetch(
        `${API_URL}/tentativas/?${parametros.toString()}`,
        {
            method: "POST",
            headers: {
                ...obterCabecalhoAutenticacao(),
            },
        }
    );

    verificarSessaoExpirada(resposta);
    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(
            dados.detail || "Erro ao registrar tentativa."
        );
    }

    return dados;
}

export async function realizarLogin(email, senha) {
    const resposta = await fetch(`${API_URL}/usuarios/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(
            dados.detail || "Não foi possível realizar o login."
        );
    }

    localStorage.setItem("token", dados.access_token);

    return dados.usuario;
}


export async function buscarResumoProgresso(idUsuario) {
    const resposta = await fetch(
        `${API_URL}/usuarios/${idUsuario}/progresso/resumo`,
        {
            headers: {
                ...obterCabecalhoAutenticacao(),
            },
        }
    );

    verificarSessaoExpirada(resposta);
    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(
            dados.detail || "Erro ao buscar resumo do progresso."
        );
    }

    return dados;
}

export async function buscarDesempenhoAtividades(idUsuario) {
    const resposta = await fetch(
        `${API_URL}/usuarios/${idUsuario}/progresso/atividades`,
        {
            headers: {
                ...obterCabecalhoAutenticacao(),
            },
        }
    );

    verificarSessaoExpirada(resposta);
    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(
            dados.detail ||
            "Erro ao buscar desempenho das atividades."
        );
    }

    return dados;
}