
function AlunoHome({ usuario, onAtividades, onProgresso, onSair }) {
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

                <button onClick={onProgresso}>
                    Ver meu progresso
                </button>

                <button onClick={onSair}>
                    Sair
                </button>
            </section>
        </main>
    );
}

export default AlunoHome;