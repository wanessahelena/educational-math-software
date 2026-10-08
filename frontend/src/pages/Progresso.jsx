
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

    const indicadores = resumo
        ? [
              {
                  titulo: "Atividades realizadas",
                  valor: `${resumo.atividades_realizadas} / ${resumo.total_atividades}`,
                  icone: "📚",
                  cor: "azul",
              },
              {
                  titulo: "Conclusão",
                  valor: `${resumo.percentual_conclusao}%`,
                  icone: "🏁",
                  cor: "verde",
              },
              {
                  titulo: "Total de tentativas",
                  valor: resumo.total_tentativas,
                  icone: "🧩",
                  cor: "amarelo",
              },
              {
                  titulo: "Respostas corretas",
                  valor: resumo.total_corretas,
                  icone: "✓",
                  cor: "verde",
              },
              {
                  titulo: "Respostas incorretas",
                  valor: resumo.total_incorretas,
                  icone: "↻",
                  cor: "coral",
              },
              {
                  titulo: "Precisão",
                  valor: `${resumo.percentual_acerto}%`,
                  icone: "🎯",
                  cor: "azul",
              },
          ]
        : [];

    return (
        <main className="pagina-progresso">
            <div className="progresso-container">
                <button
                    type="button"
                    className="progresso-voltar"
                    onClick={onVoltar}
                >
                    ← Voltar ao início
                </button>

                <div className="progresso-cabecalho">

                    <h1>Meu progresso</h1>

                    <p>
                        Veja tudo o que você já aprendeu
                        e acompanhe suas conquistas.
                    </p>
                </div>

                {carregando ? (
                    <div className="progresso-estado">
                        <p>Carregando suas conquistas...</p>
                    </div>
                ) : erro ? (
                    <div className="progresso-estado" role="alert">
                        <h2>Não foi possível carregar seu progresso</h2>
                        <p>{erro}</p>
                    </div>
                ) : (
                    <>
                        {resumo && (
                            <section className="progresso-secao">


                                <div className="progresso-indicadores">
                                    {indicadores.map((indicador) => (
                                        <article
                                            key={indicador.titulo}
                                            className="progresso-indicador"
                                        >
                                            <span
                                                className={`progresso-indicador-icone progresso-cor-${indicador.cor}`}
                                                aria-hidden="true"
                                            >
                                                {indicador.icone}
                                            </span>

                                            <h3>{indicador.titulo}</h3>

                                            <p className="progresso-indicador-valor">
                                                {indicador.valor}
                                            </p>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section className="progresso-secao">
                            <div className="progresso-secao-titulo">
                                <h2>Desempenho por atividade</h2>
                                <p>
                                    Veja quantas vezes você tentou
                                    e acertou cada desafio.
                                </p>
                            </div>

                            {atividades.length === 0 ? (
                                <div className="progresso-vazio">
                                    <span aria-hidden="true">🌱</span>
                                    <h3>Sua jornada está começando!</h3>
                                    <p>
                                        Você ainda não realizou nenhuma atividade.
                                        Quando resolver seus primeiros desafios,
                                        suas conquistas aparecerão aqui.
                                    </p>
                                </div>
                            ) : (
                                <div className="progresso-lista">
                                    {atividades.map((atividade) => (
                                        <article
                                            className="progresso-atividade-card"
                                            key={atividade.id_atividade}
                                        >
                                            <div className="progresso-atividade-topo">
                                                <span
                                                    className="progresso-atividade-icone"
                                                    aria-hidden="true"
                                                >
                                                    🧩
                                                </span>

                                                <h3>{atividade.titulo}</h3>
                                            </div>

                                            <div className="progresso-atividade-dados">
                                                <span>
                                                    Tentativas:{" "}
                                                    <strong>
                                                        {atividade.total_tentativas}
                                                    </strong>
                                                </span>

                                                <span>
                                                    Acertos:{" "}
                                                    <strong>
                                                        {atividade.total_corretas}
                                                    </strong>
                                                </span>

                                                <span>
                                                    Erros:{" "}
                                                    <strong>
                                                        {atividade.total_incorretas}
                                                    </strong>
                                                </span>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </main>
    );
}

export default Progresso;
