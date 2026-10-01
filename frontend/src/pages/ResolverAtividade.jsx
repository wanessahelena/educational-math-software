import { useCallback, useState } from "react";
import { registrarTentativa } from "../services/api";
import BlocklyWorkspace from "../components/BlocklyWorkspace";

function ResolverAtividade({ usuario, atividade, onVoltar }){

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

    async function handleSubmit(event){
        event.preventDefault();

        setResultado(null);
        setErro("");

        if (!resposta.trim()){
            setErro("Adicione um único bloco de resposta e informe a resposta final.");
            return;
        }

        const tempoGasto = Math.floor(
            (Date.now() - inicio) / 1000
        );

        try{
            setEnviando(true);
            const tentativa = await registrarTentativa(
                usuario.id_usuario,
                atividade.id_atividade,
                resposta,
                tempoGasto
            );

            setResultado(tentativa);
        }catch (error) {
            setErro(error.message);
        }finally {
            setEnviando(false);
        }
    }

    return (
        <main className="conteudo">
            <section className="atividade-resolucao">
                <h2 className="atividade-titulo">
                    {atividade.titulo}
                </h2>

                <div className="atividade-layout">
                    <div className="atividade-lateral">
                        <div className="atividade-card">
                            <h3>Desafio</h3>

                            <p className="atividade-enunciado">
                                {atividade.descricao}
                            </p>

                            <span className="atividade-nivel">
                                Nível: {atividade.nivel}
                            </span>
                        </div>

                        <div
                            className={`atividade-card feedback-card ${
                                resultado
                                    ? resultado.status === "correta"
                                        ? "feedback-correto"
                                        : "feedback-incorreto"
                                    : erro
                                        ? "feedback-incorreto"
                                        : ""
                            }`}
                        >
                            <h3>Feedback</h3>

                            {!resultado && !erro && (
                                <p>
                                    Monte sua resolução utilizando
                                    os blocos ao lado.
                                </p>
                            )}

                            {erro && (
                                <p>{erro}</p>
                            )}

                            {resultado && (
                                <>
                                    {resultado.status === "correta" ? (
                                        <p className="feedback-mensagem">
                                            ✓ Parabéns! Sua resolução está correta!
                                        </p>
                                    ) : (
                                        <p className="feedback-mensagem">
                                            ✕ Ainda não está correto. Tente novamente!
                                        </p>
                                    )}

                                    <p className="feedback-tempo">
                                        Tempo gasto: {resultado.tempo_gasto} segundos
                                    </p>
                                </>
                            )}
                        </div>

                            <button
                                type="button"
                                className="botao-voltar"
                                onClick={onVoltar}
                            >
                                Voltar para atividades
                            </button>

                    </div>

                    <div className="atividade-blocos">
                        <BlocklyWorkspace
                            onRespostaChange={
                                atualizarRespostaBlockly
                            }
                        />

                        {resultado?.status !== "correta" && (
                            <form onSubmit={handleSubmit}>
                                <button
                                    type="submit"
                                    className="botao-verificar"
                                    disabled={enviando}
                                >
                                    {enviando
                                        ? "Verificando..."
                                        : "Verificar resolução"}
                                </button>
                            </form>
                        )}

                    </div>
                </div>
            </section>
        </main>
    );
}

export default ResolverAtividade;