
function Home({ onLogin, onCadastro }) {
    return (
        <main className="conteudo">
            <section className="boas-vindas">
                <h2>Bem-vindo!</h2>

                <p>
                    Aprenda matemática de forma interativa,
                    por meio de desafios e atividades.
                </p>

                <p>
                    Entre na sua conta ou crie seu cadastro
                    para começar.
                </p>

                <div className="home-acoes">
                    <button type="button" onClick={onLogin}>
                        Entrar
                    </button>

                    <button type="button" onClick={onCadastro}>
                        Criar cadastro
                    </button>
                </div>
                
            </section>
        </main>
    );
}

export default Home;