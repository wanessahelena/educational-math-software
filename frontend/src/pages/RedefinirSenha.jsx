import { useState } from "react";
import { LockKeyhole, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { redefinirSenha } from "../services/api";

function RedefinirSenha({ onLogin }) {
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [carregando, setCarregando] = useState(false);

    const token = new URLSearchParams(
        window.location.search
    ).get("token");

    async function handleSubmit(event) {
        event.preventDefault();
        setErro("");
        setSucesso("");

        if (novaSenha.length < 8) {
            setErro("A senha deve ter pelo menos 8 caracteres.");
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        if (!token) {
            setErro("Link de recuperação inválido.");
            return;
        }

        setCarregando(true);

        try {
            const dados = await redefinirSenha(token, novaSenha);
            setSucesso(dados.mensagem);
            setNovaSenha("");
            setConfirmarSenha("");
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
                        <LockKeyhole size={26} />
                    </span>
                    <span className="autenticacao-marca">
                        Mate<span>lógica</span>
                    </span>
                </div>

                <div className="autenticacao-apresentacao">
                    <h1>Redefinir senha</h1>
                    <p>
                        Crie uma nova senha para acessar sua conta.
                    </p>
                </div>

                {!sucesso ? (
                    <form onSubmit={handleSubmit}>
                        <div className="autenticacao-campo">
                            <label htmlFor="nova-senha">
                                Nova senha
                            </label>

                            <div className="campo-senha">
                                <input
                                    id="nova-senha"
                                    type={mostrarSenha ? "text" : "password"}
                                    value={novaSenha}
                                    onChange={(event) =>
                                        setNovaSenha(event.target.value)
                                    }
                                    placeholder="Mínimo de 8 caracteres"
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                />

                                <button
                                    type="button"
                                    className="botao-visualizar-senha"
                                    onClick={() =>
                                        setMostrarSenha(!mostrarSenha)
                                    }
                                    aria-label={
                                        mostrarSenha
                                            ? "Ocultar senha"
                                            : "Mostrar senha"
                                    }
                                >
                                    {mostrarSenha ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="autenticacao-campo">
                            <label htmlFor="confirmar-senha">
                                Confirmar nova senha
                            </label>

                            <div className="campo-senha">
                                <input
                                    id="confirmar-senha"
                                    type={mostrarConfirmacao ? "text" : "password"}
                                    value={confirmarSenha}
                                    onChange={(event) =>
                                        setConfirmarSenha(event.target.value)
                                    }
                                    placeholder="Digite a senha novamente"
                                    autoComplete="new-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="botao-visualizar-senha"
                                    onClick={() =>
                                        setMostrarConfirmacao(!mostrarConfirmacao)
                                    }
                                    aria-label={
                                        mostrarConfirmacao
                                            ? "Ocultar confirmação de senha"
                                            : "Mostrar confirmação de senha"
                                    }
                                    aria-pressed={mostrarConfirmacao}
                                >
                                    {mostrarConfirmacao ? (
                                        <EyeOff size={18} aria-hidden="true" />
                                    ) : (
                                        <Eye size={18} aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {erro && (
                            <p className="mensagem-erro" role="alert">
                                {erro}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="autenticacao-botao"
                            disabled={carregando}
                        >
                            {carregando
                                ? "Redefinindo..."
                                : "Salvar nova senha"}
                        </button>
                    </form>
                ) : (
                    <p className="mensagem-sucesso" role="status">
                        {sucesso}
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

export default RedefinirSenha;