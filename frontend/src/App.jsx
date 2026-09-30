
import { useEffect, useState } from "react";

import "./App.css";

import Header from "./components/Header";

import Home from "./pages/Home";

import Login from "./pages/Login";

import Cadastro from "./pages/Cadastro";

import AlunoHome from "./pages/AlunoHome";

import Atividades from "./pages/Atividades";

import ResolverAtividade from "./pages/ResolverAtividade";

import Progresso from "./pages/Progresso";

function App() {
    const [usuario, setUsuario] = useState(() => {
        try {
                const usuarioSalvo = localStorage.getItem("usuario");
                return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
            } catch {
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

    function finalizarCadastro(novoUsuario) {
        setUsuario(novoUsuario);
        setPagina("aluno");
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
        setUsuario(null);
        setAtividadeSelecionada(null);
        setPagina("home");
    }

    return (
        <div className="app">
            <Header />

            {usuario && (
                <nav className="menu-aluno">
                    <button
                        onClick={() => {
                            setAtividadeSelecionada(null);
                            setPagina("aluno");
                        }}
                    >
                        Início
                    </button>

                    <button
                        onClick={() => setPagina("atividades")}
                    >
                        Atividades
                    </button>

                    <button
                        onClick={() => setPagina("progresso")}
                    >
                        Meu progresso
                    </button>

                    <button
                        onClick={sair}
                    >
                        Sair
                    </button>
                </nav>
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
                    onSair={sair}
                />
            )}

            {pagina === "progresso" && usuario && (
                <Progresso
                    usuario={usuario}
                    onVoltar={() => setPagina("aluno")}
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