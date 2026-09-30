import { useEffect, useState } from "react";
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

    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    useEffect(() => {
        buscarAnosEscolares()
        .then((dados) => {
            setAnos(dados);
        })
        .catch(() => {
            setErro("Não foi possível carregar os anos escolares.");
        });
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();

        setMensagem("");
        setErro("");

        if (!nome || !email || !senha || !idAno) {
        setErro("Preencha todos os campos.");
        return;
        }

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
        }
    }

    return (
        <main className="conteudo">
        <section className="boas-vindas">
            <h2>Cadastro do aluno</h2>

            <p>Preencha seus dados para começar.</p>

            <form onSubmit={handleSubmit}>
            <div>
                <label>Nome:</label>
                <br />
                <input
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                />
            </div>

            <br />

            <div>
                <label>E-mail:</label>
                <br />
                <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                />
            </div>

            <br />

            <div>
                <label>Senha:</label>
                <br />
                <input
                type="password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                />
            </div>

            <br />

            <div>
                <label>Ano escolar:</label>
                <br />

                <select
                value={idAno}
                onChange={(event) => setIdAno(event.target.value)}
                >
                <option value="">Selecione seu ano</option>

                {anos.map((ano) => (
                    <option key={ano.id_ano} value={ano.id_ano}>
                    {ano.nome}
                    </option>
                ))}
                </select>
            </div>

            <br />

            <button type="submit">
                Cadastrar
            </button>
            </form>

            {mensagem && <p>{mensagem}</p>}

            {erro && <p>{erro}</p>}
        </section>
        </main>
    );
}

export default Cadastro;