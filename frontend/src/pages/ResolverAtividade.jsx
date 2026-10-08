
import { useCallback, useState } from "react";
import { registrarTentativa } from "../services/api";
import BlocklyWorkspace from "../components/BlocklyWorkspace";

function ResolverAtividade({ usuario, atividade, onVoltar }) {
    const [resposta, setResposta] = useState("");
    const [resultado, setResultado] = useState(null);
    const [erro, setErro] = useState("");
    const [inicio] = useState(Date.now());
    const [enviando, setEnviando] = useState(false);

    const atualizarRespostaBlockly = useCallback((valor) => {
        setResposta(valor);
        setResultado(null);
        setErro("");
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();

        setResultado(null);
        setErro("");

        if (!resposta.trim()) {
            setErro(
                "Adicione um único bloco de resposta e informe a resposta final."
            );
            return;
        }

        const tempoGasto = Math.floor(
            (Date.now() - inicio) / 1000
        );

        try {
            setEnviando(true);

            const tentativa = await registrarTentativa(
                usuario.id_usuario,
                atividade.id_atividade,
                resposta,
                tempoGasto
            );

            setResultado(tentativa);
        } catch (error) {
            setErro(error.message);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <main className="pagina-resolucao">
            <div className="resolucao-container">
                <div className="resolucao-topo">
                    <button
                        type="button"
                        className="resolucao-voltar"
                        onClick={onVoltar}
                    >
                        ← Voltar às atividades
                    </button>

                    <h1>{atividade.titulo}</h1>

                    <p>
                        Leia o desafio, organize seus blocos
                        e descubra a resposta.
                    </p>
                </div>

                <div className="resolucao-layout">
                    <aside className="resolucao-lateral">
                        <section className="resolucao-card resolucao-desafio">
                            <div className="resolucao-card-cabecalho">
                                <span
                                    className="resolucao-card-icone"
                                    aria-hidden="true"
                                >
                                    🧩
                                </span>

                                <h2>Seu desafio</h2>
                            </div>

                            <p className="resolucao-enunciado">
                                {atividade.descricao}
                            </p>

                            <span className="resolucao-nivel">
                                Nível: {atividade.nivel}
                            </span>
                        </section>

                        <section
                            className={`resolucao-card resolucao-feedback ${
                                resultado
                                    ? resultado.status === "correta"
                                        ? "resolucao-feedback-correto"
                                        : "resolucao-feedback-incorreto"
                                    : erro
                                        ? "resolucao-feedback-incorreto"
                                        : ""
                            }`}
                            aria-live="polite"
                        >
                            <div className="resolucao-card-cabecalho">
                                <span
                                    className="resolucao-card-icone resolucao-icone-feedback"
                                    aria-hidden="true"
                                >
                                    ⭐
                                </span>

                                <h2>Como você está indo?</h2>
                            </div>

                            {!resultado && !erro && (
                                <p>
                                    Monte sua resolução usando os blocos
                                    e clique em verificar quando terminar.
                                </p>
                            )}

                            {erro && (
                                <p role="alert">{erro}</p>
                            )}

                            {resultado && (
                                <>
                                    {resultado.status === "correta" ? (
                                        <p className="resolucao-feedback-mensagem">
                                            ✓ Parabéns! Sua resposta está correta!
                                        </p>
                                    ) : (
                                        <p className="resolucao-feedback-mensagem">
                                            Ainda não está correto.
                                            Você pode tentar novamente!
                                        </p>
                                    )}

                                    <p className="resolucao-feedback-tempo">
                                        Tempo gasto: {resultado.tempo_gasto} segundos
                                    </p>
                                </>
                            )}
                        </section>
                    </aside>

                    <section className="resolucao-area">
                        <div className="resolucao-area-cabecalho">
                            <div>
                                <h2>Monte sua resolução</h2>
                                <p>
                                    Use os blocos disponíveis para organizar
                                    seu raciocínio.
                                </p>
                            </div>

                            <span className="resolucao-area-etapa">
                                Passo a passo
                            </span>
                        </div>

                        <div className="resolucao-workspace">
                            <BlocklyWorkspace
                                blocosPermitidos={atividade.blocos_permitidos}
                                onRespostaChange={atualizarRespostaBlockly}
                            />
                        </div>

                        {resultado?.status !== "correta" && (
                            <form
                                className="resolucao-formulario"
                                onSubmit={handleSubmit}
                            >
                                <button
                                    type="submit"
                                    className="resolucao-verificar"
                                    disabled={enviando}
                                >
                                    {enviando
                                        ? "Verificando..."
                                        : "✓ Verificar resposta"}
                                </button>
                            </form>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}

export default ResolverAtividade;
