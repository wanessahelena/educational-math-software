
import { useEffect, useState } from "react";

import "./App.css";

import MenuAluno from "./components/MenuAluno";

import Home from "./pages/Home";

import Login from "./pages/Login";

import Cadastro from "./pages/Cadastro";

import AlunoHome from "./pages/AlunoHome";

import Atividades from "./pages/Atividades";

import ResolverAtividade from "./pages/ResolverAtividade";

import Progresso from "./pages/Progresso";

import Perfil from "./pages/Perfil";

function App() {
    const [usuario, setUsuario] = useState(() => {
        try {
            const token = localStorage.getItem("token");
            const usuarioSalvo = localStorage.getItem("usuario");

            if (!token || !usuarioSalvo) {
                localStorage.removeItem("token");
                localStorage.removeItem("usuario");
                return null;
            }

            return JSON.parse(usuarioSalvo);
        } catch {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            return null;
        }
    });

    const [pagina, setPagina] = useState(
        usuario ? "aluno" : "home"
    );

    const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);

    useEffect(() => {
        if (usuario) {
            localStorage.setItem("usuario", JSON.stringify(usuario));
        }else{
            localStorage.removeItem("usuario");
            }
    }, [usuario]);

    useEffect(() => {
    function tratarSessaoExpirada() {
        setUsuario(null);
        setAtividadeSelecionada(null);
        setPagina("login");
    }

    window.addEventListener(
        "sessao-expirada",
        tratarSessaoExpirada
    );

    return () => {
        window.removeEventListener(
            "sessao-expirada",
            tratarSessaoExpirada
        );
    };
}, []);

    function finalizarCadastro() {
        setUsuario(null);
        setAtividadeSelecionada(null);
        setPagina("login");
    }

    function finalizarLogin(usuarioAutenticado) {
        setUsuario(usuarioAutenticado);
        setPagina("aluno");
    }

    function selecionarAtividade(atividade) {
        setAtividadeSelecionada(atividade);
        setPagina("resolver");
    }

    function sair() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        setUsuario(null);
        setAtividadeSelecionada(null);
        setPagina("home");
    }

    async function atualizarPerfil(dadosAtualizados) {
        const token = localStorage.getItem("token");

        const resposta = await fetch(
            `http://127.0.0.1:8000/usuarios/${usuario.id_usuario}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(dadosAtualizados)
            }
        );

        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => ({}));

            throw new Error(
                typeof erro.detail === "string"
                    ? erro.detail
                    : "Não foi possível atualizar o perfil."
            );
        }

        const usuarioAtualizado = await resposta.json();

        setUsuario(usuarioAtualizado);

        return usuarioAtualizado;
    }

    async function alterarSenha(dadosSenha) {
        const token = localStorage.getItem("token");

        const resposta = await fetch(
            `http://127.0.0.1:8000/usuarios/${usuario.id_usuario}/senha`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(dadosSenha)
            }
        );

        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => ({}));

            throw new Error(
                typeof erro.detail === "string"
                    ? erro.detail
                    : "Não foi possível alterar a senha."
            );
        }

        // A alteração invalida o token atual.
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        setUsuario(null);
        setAtividadeSelecionada(null);
        setPagina("login");

        return resposta.json();
    }

    return (
        <div className="app">


        {usuario && (
            <MenuAluno
                pagina={pagina}
                onInicio={() => {
                    setAtividadeSelecionada(null);
                    setPagina("aluno");
                }}
                onAtividades={() => {
                    setAtividadeSelecionada(null);
                    setPagina("atividades");
                }}
                onProgresso={() => {
                    setAtividadeSelecionada(null);
                    setPagina("progresso");
                }}
                onPerfil={() => {
                    setAtividadeSelecionada(null);
                    setPagina("perfil");
                }}
                onSair={sair}
            />
        )}


            {pagina === "home" && (
                <Home
                    onLogin={() => setPagina("login")}
                    onCadastro={() => setPagina("cadastro")}
                />
            )}

            {pagina === "login" && (
                <Login
                    onLogin={finalizarLogin}
                    onCadastro={() => setPagina("cadastro")}
                    onVoltar={() => setPagina("home")}
                />
            )}

            {pagina === "cadastro" && (
                <Cadastro
                    onCadastro={finalizarCadastro}
                />
            )}

            {pagina === "aluno" && usuario && (
                <AlunoHome
                    usuario={usuario}
                    onAtividades={() => setPagina("atividades")}
                    onProgresso={() => setPagina("progresso")}
                />
            )}

            {pagina === "progresso" && usuario && (
                <Progresso
                    usuario={usuario}
                    onVoltar={() => setPagina("aluno")}
                />
            )}

            {pagina === "perfil" && usuario && (
                <Perfil
                    usuario={usuario}
                    onSalvar={atualizarPerfil}
                    onAlterarSenha={alterarSenha}
                />
            )}

            {pagina === "atividades" && usuario && (
                <Atividades
                    usuario={usuario}
                    onResolver={selecionarAtividade}
                />
            )}

            {pagina === "resolver" &&
                usuario &&
                atividadeSelecionada && (
                    <ResolverAtividade
                        usuario={usuario}
                        atividade={atividadeSelecionada}
                        onVoltar={() => setPagina("atividades")}
                    />
                )}
        </div>
    );
}

export default App;