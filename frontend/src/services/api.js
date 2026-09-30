const API_URL = "http://127.0.0.1:8000";

export async function buscarAnosEscolares() {
    const resposta = await fetch(`${API_URL}/anos-escolares/`);

    if (!resposta.ok) {
        throw new Error("Erro ao buscar anos escolares.");
    }

    return await resposta.json();
    }

    export async function cadastrarUsuario(nome, email, senha, idAno) {
    const parametros = new URLSearchParams({
        nome: nome,
        email: email,
        senha_hash: senha,
        id_ano: idAno,
    });

    const resposta = await fetch(
        `${API_URL}/usuarios/?${parametros.toString()}`,
        {
        method: "POST",
        }
    );

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
        }
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(
        dados.detail || "Erro ao registrar tentativa."
        );
    }

    return dados;
}