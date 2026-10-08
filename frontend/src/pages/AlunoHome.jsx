
function AlunoHome({ usuario, onAtividades, onProgresso, onSair }) {
    return (
        <main className="conteudo">
            <section className="boas-vindas">
                <div className="aluno-apresentacao">
                    <h2>Olá, {usuario.nome}!</h2>

                    <p className="aluno-mensagem">
                        Seja bem-vindo ao Software Educacional Matemático.
                    </p>

                    <p className="aluno-ano">
                        Você está cadastrado no{" "}
                        <strong>{usuario.id_ano}º ano</strong>.
                    </p>
                </div>

                <div className="aluno-acoes">
                    <button type="button" onClick={onAtividades}>
                        Ver atividades
                    </button>

                    <button type="button" onClick={onProgresso}>
                        Ver meu progresso
                    </button>

                    <button type="button" onClick={onSair}>
                        Sair
                    </button>
                </div>
            </section>
        </main>
    );
}

export default AlunoHome;
