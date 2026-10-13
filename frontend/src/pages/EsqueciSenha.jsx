import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { solicitarRecuperacaoSenha } from "../services/api";

function EsqueciSenha({ onVoltar }) {
    const [email, setEmail] = useState("");
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setErro("");
        setMensagem("");
        setCarregando(true);

        try {
            const dados = await solicitarRecuperacaoSenha(email.trim());
            setMensagem(dados.mensagem);
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className="pagina-autenticacao">
            <section className="cartao-autenticacao">
                <div className="autenticacao-topo">
                    <span className="autenticacao-icone">
                        <Mail size={26} />
                    </span>
                    <span className="autenticacao-marca">
                        Mate<span>lógica</span>
                    </span>
                </div>

                <div className="autenticacao-apresentacao">
                    <h1>Esqueceu sua senha?</h1>
                    <p>
                        Informe seu e-mail cadastrado para receber
                        um link de recuperação de senha.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="autenticacao-campo">
                        <label htmlFor="recuperacao-email">E-mail</label>
                        <input
                            id="recuperacao-email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Digite seu e-mail"
                            autoComplete="email"
                            required
                        />
                    </div>

                    {erro && (
                        <p className="mensagem-erro" role="alert">
                            {erro}
                        </p>
                    )}

                    {mensagem && (
                        <p className="mensagem-sucesso" role="status">
                            {mensagem}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="autenticacao-botao"
                        disabled={carregando}
                    >
                        {carregando ? "Enviando..." : "Enviar link de recuperação"}
                    </button>
                </form>

                <button
                    type="button"
                    className="autenticacao-voltar"
                    onClick={onVoltar}
                >
                    <ArrowLeft size={17} />
                    Voltar para o login
                </button>
            </section>
        </main>
    );
}

export default EsqueciSenha;