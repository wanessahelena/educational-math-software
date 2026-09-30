import { useState } from "react";
import { registrarTentativa } from "../services/api";

function ResolverAtividade({ usuario, atividade, onVoltar }) {
    const [resposta, setResposta] = useState("");
    const [resultado, setResultado] = useState(null);
    const [erro, setErro] = useState("");

    const [inicio] = useState(Date.now());

    async function handleSubmit(event) {
        event.preventDefault();

        setResultado(null);
        setErro("");

        if (!resposta.trim()) {
        setErro("Digite uma resposta.");
        return;
        }

        const tempoGasto = Math.floor(
        (Date.now() - inicio) / 1000
        );

        try {
        const tentativa = await registrarTentativa(
            usuario.id_usuario,
            atividade.id_atividade,
            resposta,
            tempoGasto
        );

        setResultado(tentativa);
        } catch (error) {
        setErro(error.message);
        }
    }

    return (
        <main className="conteudo">
        <section className="boas-vindas">
            <h2>{atividade.titulo}</h2>

            <p>{atividade.descricao}</p>

            <p>
            Nível: {atividade.nivel}
            </p>

            <form onSubmit={handleSubmit}>
            <label>
                Sua resposta:
            </label>

            <br />

            <input
                type="text"
                value={resposta}
                onChange={(event) => setResposta(event.target.value)}
            />

            <br />
            <br />

            <button type="submit">
                Enviar resposta
            </button>
            </form>

            {erro && <p>{erro}</p>}

            {resultado && (
            <div>
                {resultado.status === "correta" ? (
                <p>Parabéns! Você acertou! 🎉</p>
                ) : (
                <p>Resposta incorreta. Tente novamente!</p>
                )}

                <p>
                Tempo gasto: {resultado.tempo_gasto} segundos
                </p>

                <button onClick={onVoltar}>
                Voltar para atividades
                </button>
            </div>
            )}
        </section>
        </main>
    );
}

export default ResolverAtividade;