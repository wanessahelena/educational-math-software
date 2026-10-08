
import { useEffect, useState } from "react";
import {
    buscarResumoProgresso,
    buscarDesempenhoAtividades,
} from "../services/api";

function Progresso({ usuario, onVoltar }) {
    const [resumo, setResumo] = useState(null);
    const [atividades, setAtividades] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativo = true;

        async function carregarProgresso() {
            try {
                setCarregando(true);
                setErro("");

                const [dadosResumo, dadosAtividades] =
                    await Promise.all([
                        buscarResumoProgresso(usuario.id_usuario),
                        buscarDesempenhoAtividades(usuario.id_usuario),
                    ]);

                if (ativo) {
                    setResumo(dadosResumo);
                    setAtividades(dadosAtividades);
                }
            } catch (error) {
                if (ativo) {
                    setErro(error.message);
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        carregarProgresso();

        return () => {
            ativo = false;
        };
    }, [usuario.id_usuario]);

    if (carregando) {
        return (
            <main className="conteudo">
                <p>Carregando seu progresso...</p>
            </main>
        );
    }

    if (erro) {
        return (
            <main className="conteudo">
                <section className="boas-vindas">
                    <h2>Meu progresso</h2>
                    <p className="mensagem-erro">{erro}</p>
                    <button onClick={onVoltar}>Voltar</button>
                </section>
            </main>
        );
    }

    return (
        <main className="conteudo">
            <section className="boas-vindas">
                <h2>Meu progresso</h2>
                <p>Acompanhe seu desempenho nas atividades.</p>

                {resumo && (
                    <div className="progresso-resumo">
                        <div className="progresso-card">
                            <h3>Atividades realizadas</h3>
                            <p>
                                {resumo.atividades_realizadas} /{" "}
                                {resumo.total_atividades}
                            </p>
                        </div>

                        <div className="progresso-card">
                            <h3>Conclusão</h3>
                            <p>{resumo.percentual_conclusao}%</p>
                        </div>

                        <div className="progresso-card">
                            <h3>Total de tentativas</h3>
                            <p>{resumo.total_tentativas}</p>
                        </div>

                        <div className="progresso-card">
                            <h3>Respostas corretas</h3>
                            <p>{resumo.total_corretas}</p>
                        </div>

                        <div className="progresso-card">
                            <h3>Respostas incorretas</h3>
                            <p>{resumo.total_incorretas}</p>
                        </div>

                        <div className="progresso-card">
                            <h3>Precisão</h3>
                            <p>{resumo.percentual_acerto}%</p>
                        </div>
                    </div>
                )}

                <h3>Desempenho por atividade</h3>

                {atividades.length === 0 ? (
                    <p>
                        Você ainda não realizou nenhuma atividade.
                        Quando começar a resolver os desafios,
                        seu desempenho aparecerá aqui.
                    </p>
                ) : (
                    <div className="lista-progresso">
                        {atividades.map((atividade) => (
                            <article
                                className="progresso-atividade"
                                key={atividade.id_atividade}
                            >
                                <h4>{atividade.titulo}</h4>

                                <p>
                                    Tentativas: {atividade.total_tentativas}
                                </p>

                                <p>
                                    Acertos: {atividade.total_corretas}
                                </p>

                                <p>
                                    Erros: {atividade.total_incorretas}
                                </p>
                            </article>
                        ))}
                    </div>
                )}

                <button onClick={onVoltar}>
                    Voltar à área do aluno
                </button>
            </section>
        </main>
    );
}

export default Progresso;