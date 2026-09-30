
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
                <button
                    type="button"
                    className="botao-voltar"
                    onClick={onVoltar}
                >
                    ← Voltar
                </button>

                <h1>Entrar</h1>
                <p>Faça login para continuar aprendendo matemática.</p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Digite seu e-mail"
                        autoComplete="email"
                        required
                    />

                    <label htmlFor="senha">Senha</label>
                    <input
                        id="senha"
                        type="password"
                        value={senha}
                        onChange={(event) => setSenha(event.target.value)}
                        placeholder="Digite sua senha"
                        autoComplete="current-password"
                        required
                    />

                    {erro && <p className="mensagem-erro">{erro}</p>}

                    <button
                        type="submit"
                        disabled={carregando}
                    >
                        {carregando ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <p className="texto-cadastro">
                    Ainda não tem cadastro?{" "}
                    <button type="button" onClick={onCadastro}>
                        Criar cadastro
                    </button>
                </p>
            </section>
        </main>
    );
}

export default Login;