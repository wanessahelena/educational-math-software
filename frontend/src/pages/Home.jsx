
import {
    Sparkles,
    Pencil,
    Circle,
    BrainCircuit,
    GraduationCap,
    Trophy
} from "lucide-react";

function Home({ onLogin, onCadastro }) {
    return (
        <main className="home">
            <div className="home-container">
                <header className="home-cabecalho">
                    <div className="home-marca">
                        <span className="home-logo" aria-hidden="true">
                            <Sparkles size={26} strokeWidth={2.5} />
                        </span>
                        <span>
                            Mate<span className="home-marca-verde">lógica</span>
                        </span>
                    </div>

                    <button
                        type="button"
                        className="home-entrar-topo"
                        onClick={onLogin}
                    >
                        Entrar
                    </button>
                </header>

                <section className="home-hero">
                    <div className="home-texto">
                        <h1>
                            Aprender matemática pode ser{" "}
                            <span>divertido.</span>
                        </h1>

                        <p>
                            Desafios de números e lógica para alunos
                            do 1º ao 5º ano. Um passo de cada vez.
                        </p>

                        <div className="home-acoes">
                            <button
                                type="button"
                                className="home-botao home-botao-azul"
                                onClick={onLogin}
                            >
                                Entrar
                            </button>

                            <button
                                type="button"
                                className="home-botao home-botao-verde"
                                onClick={onCadastro}
                            >
                                Criar conta
                            </button>
                        </div>
                    </div>

                    <div
                        className="home-ilustracao"
                        aria-label="Ilustração de uma soma matemática"
                    >
                        <div className="home-operacao" aria-hidden="true">
                            <span className="home-numero home-numero-um">1</span>
                            <span className="home-sinal home-sinal-mais">+</span>
                            <span className="home-numero home-numero-dois">2</span>
                            <span className="home-sinal home-sinal-igual">=</span>
                            <span className="home-numero home-numero-tres">3</span>
                        </div>

                        <div className="home-cubos" aria-hidden="true">
                            <span className="home-cubo home-cubo-azul">1</span>
                            <span className="home-cubo home-cubo-verde">2</span>
                            <span className="home-cubo home-cubo-amarelo">3</span>
                        </div>

                        <div className="home-ilustracao-rodape" aria-hidden="true">
                            <Pencil size={35} strokeWidth={2.5} />
                            <Sparkles size={35} strokeWidth={2.5} />
                            <Circle size={30} strokeWidth={2.5} />
                        </div>
                    </div>
                </section>

                <section
                    className="home-beneficios"
                    aria-label="Benefícios da ferramenta"
                >
                    <article className="home-beneficio">
                        <div
                            className="home-beneficio-icone icone-azul"
                            aria-hidden="true"
                        >
                            <BrainCircuit size={29} strokeWidth={2.2} />
                        </div>
                        <div>
                            <h2>Pense com lógica</h2>
                            <p>
                                Resolva desafios por meio da lógica
                                de programação.
                            </p>
                        </div>
                    </article>

                    <article className="home-beneficio">
                        <div
                            className="home-beneficio-icone icone-verde"
                            aria-hidden="true"
                        >
                            <GraduationCap size={29} strokeWidth={2.2} />
                        </div>
                        <div>
                            <h2>No seu ritmo</h2>
                            <p>Atividades do seu ano escolar.</p>
                        </div>
                    </article>

                    <article className="home-beneficio">
                        <div
                            className="home-beneficio-icone icone-amarelo"
                            aria-hidden="true"
                        >
                            <Trophy size={29} strokeWidth={2.2} />
                        </div>
                        <div>
                            <h2>Veja sua evolução</h2>
                            <p>Acompanhe cada conquista.</p>
                        </div>
                    </article>
                </section>
            </div>
        </main>
    );
}

export default Home;
