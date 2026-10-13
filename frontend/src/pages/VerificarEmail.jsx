import { useEffect, useState } from "react";
import { CheckCircle, CircleAlert, LoaderCircle } from "lucide-react";

const confirmacoesEmAndamento = new Map();

function confirmarToken(token) {
    if (!confirmacoesEmAndamento.has(token)) {
        const requisicao = fetch(
            `http://127.0.0.1:8000/usuarios/verificar-email?token=${encodeURIComponent(token)}`,
            { method: "POST" }
        )
            .then(async (resposta) => {
                const dados = await resposta.json();

                if (!resposta.ok) {
                    throw new Error(
                        dados.detail || "Não foi possível confirmar o e-mail."
                    );
                }

                return dados;
            })
            .finally(() => {
                confirmacoesEmAndamento.delete(token);
            });

        confirmacoesEmAndamento.set(token, requisicao);
    }

    return confirmacoesEmAndamento.get(token);
}

function VerificarEmail({ onLogin }) {
    const [estado, setEstado] = useState("carregando");
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        const parametros = new URLSearchParams(window.location.search);
        const token = parametros.get("token");

        if (!token) {
            setEstado("erro");
            setMensagem("Link de confirmação inválido.");
            return;
        }

        let ativo = true;

        async function confirmarEmail() {
            try {
                await confirmarToken(token);

                if (ativo) {
                    setEstado("sucesso");
                    setMensagem("Seu e-mail foi confirmado com sucesso!");
                }
            } catch (erro) {
                if (ativo) {
                    setEstado("erro");
                    setMensagem(
                        erro.message || "Erro ao verificar o e-mail."
                    );
                }
            }
        }

        confirmarEmail();

        return () => {
            ativo = false;
        };
    }, []);

    return (
        <main className="pagina-verificacao-email">
            {estado === "carregando" && (
                <>
                    <LoaderCircle size={42} />
                    <h1>Verificando seu e-mail...</h1>
                    <p>Aguarde enquanto confirmamos seu cadastro.</p>
                </>
            )}

            {estado === "sucesso" && (
                <>
                    <CheckCircle size={48} />
                    <h1>E-mail confirmado!</h1>
                    <p>{mensagem}</p>
                    <button onClick={onLogin}>
                        Ir para o login
                    </button>
                </>
            )}

            {estado === "erro" && (
                <>
                    <CircleAlert size={48} />
                    <h1>Não foi possível confirmar</h1>
                    <p>{mensagem}</p>
                    <button onClick={onLogin}>
                        Voltar para o login
                    </button>
                </>
            )}
        </main>
    );
}

export default VerificarEmail;