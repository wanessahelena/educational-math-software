
import {
    BookOpen,
    Puzzle,
    ChartNoAxesCombined,
    ArrowRight
} from "lucide-react";

function AlunoHome({ usuario, onAtividades, onProgresso }) {
    const primeiroNome = usuario.nome?.trim().split(/\s+/)[0] || "Estudante";

    return (
        <main className="painel-aluno">
            <div className="painel-container">
                <section className="painel-boas-vindas">
                    <div className="painel-saudacao">
                        <h1>
                            Olá, <span>{primeiroNome}!</span>
                        </h1>

                        <p>
                            Preparado para aprender matemática
                            com novos desafios?
                        </p>

                        <div className="painel-ano">
                            <BookOpen size={20} aria-hidden="true" />
                            <span>
                                Você está no <strong>{usuario.id_ano}º ano</strong>
                            </span>
                        </div>
                    </div>

                    <div className="painel-decoracao" aria-hidden="true">
                        <span className="painel-simbolo painel-simbolo-um">+</span>
                        <span className="painel-simbolo painel-simbolo-dois">×</span>
                        <span className="painel-simbolo painel-simbolo-tres">÷</span>
                        <span className="painel-simbolo painel-simbolo-quatro">=</span>
                    </div>
                </section>

                <section className="painel-opcoes">
                    <div className="painel-secao-titulo">
                        <h2>O que vamos fazer hoje?</h2>
                        <p>Escolha por onde deseja começar.</p>
                    </div>

                    <div className="painel-cartoes">
                        <article className="painel-cartao painel-cartao-atividades">
                            <div
                                className="painel-cartao-icone painel-icone-azul"
                                aria-hidden="true"
                            >
                                <Puzzle size={32} strokeWidth={2} />
                            </div>

                            <h3>Explorar atividades</h3>

                            <p>
                                Resolva desafios de matemática
                                e pratique seu raciocínio lógico.
                            </p>

                            <button
                                type="button"
                                className="painel-botao painel-botao-azul"
                                onClick={onAtividades}
                            >
                                Ver atividades
                                <ArrowRight size={18} aria-hidden="true" />
                            </button>
                        </article>

                        <article className="painel-cartao painel-cartao-progresso">
                            <div
                                className="painel-cartao-icone painel-icone-verde"
                                aria-hidden="true"
                            >
                                <ChartNoAxesCombined size={32} strokeWidth={2} />
                            </div>

                            <h3>Meu progresso</h3>

                            <p>
                                Veja as atividades realizadas
                                e acompanhe seu aprendizado.
                            </p>

                            <button
                                type="button"
                                className="painel-botao painel-botao-verde"
                                onClick={onProgresso}
                            >
                                Ver meu progresso
                                <ArrowRight size={18} aria-hidden="true" />
                            </button>
                        </article>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default AlunoHome;
