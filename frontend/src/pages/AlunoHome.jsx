function AlunoHome({ usuario, onAtividades }) {
    return (
        <main className="conteudo">
        <section className="boas-vindas">
            <h2>Olá, {usuario.nome}!</h2>

            <p>
            Seja bem-vindo ao Software Educacional Matemático.
            </p>

            <p>
            Você está cadastrado no{" "}
            <strong>{usuario.id_ano}° ano</strong>.
            </p>

            <br />

            <button onClick={onAtividades}>
            Ver atividades
            </button>

            <button>
            Ver meu progresso
            </button>
        </section>
        </main>
    );
}

export default AlunoHome;