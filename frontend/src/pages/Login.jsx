
import { useState } from "react";
import { realizarLogin } from "../services/api";

function Login({ onLogin, onCadastro, onVoltar }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setErro("");
        setCarregando(true);

        try {
            const usuario = await realizarLogin(email, senha);
            onLogin(usuario);
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
                    <span className="autenticacao-icone" aria-hidden="true">
                        ✦
                    </span>
                    <span className="autenticacao-marca">
                        Mate<span>lógica</span>
                    </span>
                </div>

                <div className="autenticacao-apresentacao">

                    <h1>Bem-vindo de volta!</h1>
                    <p>
                        Entre na sua conta para continuar
                        aprendendo matemática.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="autenticacao-campo">
                        <label htmlFor="login-email">E-mail</label>
                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Digite seu e-mail"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="autenticacao-campo">
                        <label htmlFor="login-senha">Senha</label>
                        <input
                            id="login-senha"
                            type="password"
                            value={senha}
                            onChange={(event) => setSenha(event.target.value)}
                            placeholder="Digite sua senha"
                            autoComplete="current-password"
                            required
                        />
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
                        {carregando ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <p className="texto-cadastro">
                    Ainda não tem uma conta?{" "}
                    <button type="button" onClick={onCadastro}>
                        Criar conta
                    </button>
                </p>

                <button
                    type="button"
                    className="autenticacao-voltar"
                    onClick={onVoltar}
                >
                    ← Voltar ao início
                </button>
            </section>
        </main>
    );
}

export default Login;
