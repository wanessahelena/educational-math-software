
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import {
    buscarAnosEscolares,
    cadastrarUsuario,
} from "../services/api";

function Cadastro({ onCadastro }) {
    const [anos, setAnos] = useState([]);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [idAno, setIdAno] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        let ativo = true;

        buscarAnosEscolares()
            .then((dados) => {
                if (ativo) setAnos(dados);
            })
            .catch(() => {
                if (ativo) {
                    setErro("Não foi possível carregar os anos escolares.");
                }
            });

        return () => {
            ativo = false;
        };
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setErro("");

        if (!nome.trim() || !email.trim() || !senha || !idAno) {
            setErro("Preencha todos os campos.");
            return;
        }

        setCarregando(true);

        try {
            const usuario = await cadastrarUsuario(
                nome,
                email,
                senha,
                idAno
            );

            onCadastro(usuario);
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
                        <Sparkles size={26} strokeWidth={2.5} />
                    </span>

                    <span className="autenticacao-marca">
                        Mate<span>lógica</span>
                    </span>
                </div>

                <div className="autenticacao-apresentacao">
                    <h1>Crie sua conta</h1>
                    <p>
                        Preencha seus dados e prepare-se para
                        aprender matemática com desafios.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="autenticacao-campo">
                        <label htmlFor="cadastro-nome">Seu nome</label>
                        <input
                            id="cadastro-nome"
                            type="text"
                            value={nome}
                            onChange={(event) => setNome(event.target.value)}
                            placeholder="Como podemos chamar você?"
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className="autenticacao-campo">
                        <label htmlFor="cadastro-email">E-mail</label>
                        <input
                            id="cadastro-email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Digite seu e-mail"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="autenticacao-campo">
                        <label htmlFor="cadastro-senha">Crie uma senha</label>
                        <input
                            id="cadastro-senha"
                            type="password"
                            value={senha}
                            onChange={(event) => setSenha(event.target.value)}
                            placeholder="Digite uma senha"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <div className="autenticacao-campo">
                        <label htmlFor="cadastro-ano">Seu ano escolar</label>
                        <select
                            id="cadastro-ano"
                            value={idAno}
                            onChange={(event) => setIdAno(event.target.value)}
                            required
                        >
                            <option value="">Selecione seu ano</option>
                            {anos.map((ano) => (
                                <option key={ano.id_ano} value={ano.id_ano}>
                                    {ano.nome}
                                </option>
                            ))}
                        </select>
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
                        {carregando ? "Criando conta..." : "Criar minha conta"}
                    </button>
                </form>

                <p className="autenticacao-observacao">
                    Depois do cadastro, você poderá entrar com
                    seu e-mail e senha.
                </p>
            </section>
        </main>
    );
}

export default Cadastro;
