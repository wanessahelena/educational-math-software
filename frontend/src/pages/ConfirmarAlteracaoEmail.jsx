import { useEffect, useState } from "react";
import { MailCheck, ArrowLeft } from "lucide-react";

const confirmacoesPendentes = new Map();

function confirmarEmail(token) {
    if (!confirmacoesPendentes.has(token)) {
        const requisicao = fetch(
            `http://127.0.0.1:8000/usuarios/confirmar-alteracao-email?token=${encodeURIComponent(token)}`,
            { method: "POST" }
        )
            .then(async (resposta) => {
                const dados = await resposta.json();

                if (!resposta.ok) {
                    throw new Error(
                        dados.detail || "Não foi possível confirmar a alteração."
                    );
                }

                return dados;
            });

        confirmacoesPendentes.set(token, requisicao);
    }

    return confirmacoesPendentes.get(token);
}

function ConfirmarAlteracaoEmail({ onLogin }) {
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const token = new URLSearchParams(
            window.location.search
        ).get("token");

        if (!token) {
            setErro("Link de confirmação inválido.");
            setCarregando(false);
            return;
        }

        let ativo = true;

        confirmarEmail(token)
            .then((dados) => {
                if (ativo) {
                    setMensagem(dados.mensagem);
                }
            })
            .catch((error) => {
                if (ativo) {
                    setErro(error.message);
                }
            })
            .finally(() => {
                if (ativo) {
                    setCarregando(false);
                }
            });

        return () => {
            ativo = false;
        };
    }, []);

    return (
        <main className="pagina-autenticacao">
            <section className="cartao-autenticacao">
                <div className="autenticacao-topo">
                    <span className="autenticacao-icone">
                        <MailCheck size={26} />
                    </span>
                    <span className="autenticacao-marca">
                        Mat<span>Lógica</span>
                    </span>
                </div>

                <div className="autenticacao-apresentacao">
                    <h1>Confirmação de e-mail</h1>
                    <p>
                        Estamos verificando a alteração do seu endereço de e-mail.
                    </p>
                </div>

                {carregando && <p>Confirmando alteração...</p>}

                {mensagem && (
                    <p className="mensagem-sucesso" role="status">
                        {mensagem}
                    </p>
                )}

                {erro && (
                    <p className="mensagem-erro" role="alert">
                        {erro}
                    </p>
                )}

                <button
                    type="button"
                    className="autenticacao-voltar"
                    onClick={onLogin}
                >
                    <ArrowLeft size={17} />
                    Voltar para o login
                </button>
            </section>
        </main>
    );
}

export default ConfirmarAlteracaoEmail;