
import { useEffect, useState } from "react";

import {
    Navigate,
    Route,
    Routes,
    useNavigate,
    useParams,
    useSearchParams
} from "react-router-dom";


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

import VerificarEmail from "./pages/VerificarEmail";

import EsqueciSenha from "./pages/EsqueciSenha";

import RedefinirSenha from "./pages/RedefinirSenha";

import ConfirmarAlteracaoEmail from "./pages/ConfirmarAlteracaoEmail";

import { buscarAtividadesPorAno } from "./services/api";

function RotaResolverAtividade({ usuario, onVoltar }) {
    const navigate = useNavigate();
    const { id } = useParams();

    const [searchParams] = useSearchParams();
    const idConteudo = Number(searchParams.get("conteudo"));

    const [atividade, setAtividade] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [atividadesDoConteudo, setAtividadesDoConteudo] = useState([]);

    useEffect(() => {
        let ativo = true;

        async function carregarAtividade() {

            setCarregando(true);
            setErro("");
            setAtividade(null);
            setAtividadesDoConteudo([]);

            try {
                const atividades = await buscarAtividadesPorAno(
                    usuario.id_ano
                );

                const atividadeEncontrada = atividades.find(
                    (item) => item.id_atividade === Number(id)
                );

                if (!ativo) return;

                if (!atividadeEncontrada) {
                    setErro("Atividade não encontrada.");
                    return;
                }

                const atividadesFiltradas = atividades.filter((item) =>
                    item.conteudos?.some(
                        (conteudo) => conteudo.id_conteudo === idConteudo
                    )
                );

                setAtividadesDoConteudo(atividadesFiltradas);
                setAtividade(atividadeEncontrada);

            }catch (error) {
                if (ativo) {
                    setErro(error.message);
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        carregarAtividade();

        return () => {
            ativo = false;
        };
    }, [id, idConteudo, usuario.id_ano]);

    if (carregando) {
        return <p role="status">Carregando atividade...</p>;
    }

    if (erro) {
        return (
            <div role="alert">
                <p>{erro}</p>
                <button type="button" onClick={onVoltar}>
                    Voltar às atividades
                </button>
            </div>
        );
    }

    if (!atividade) {
        return null;
    }

    const indiceAtual = atividadesDoConteudo.findIndex(
    (item) => item.id_atividade === atividade.id_atividade
    );

    const atividadeAnterior =
        indiceAtual > 0
            ? atividadesDoConteudo[indiceAtual - 1]
            : null;

    const proximaAtividade =
        indiceAtual >= 0 &&
        indiceAtual < atividadesDoConteudo.length - 1
            ? atividadesDoConteudo[indiceAtual + 1]
            : null;

    return (
        <ResolverAtividade
            key={atividade.id_atividade}
            usuario={usuario}
            atividade={atividade}
            onVoltar={onVoltar}
            atividadeAnterior={atividadeAnterior}
            proximaAtividade={proximaAtividade}
            posicaoAtual={indiceAtual >= 0 ? indiceAtual + 1 : null}
            totalAtividades={atividadesDoConteudo.length}
            onAnterior={() => {
                if (atividadeAnterior) {
                    navigate(
                        `/atividades/${atividadeAnterior.id_atividade}?conteudo=${idConteudo}`,
                        { replace: true }
                    );
                }
            }}
            onProxima={() => {
                if (proximaAtividade) {
                    navigate(
                        `/atividades/${proximaAtividade.id_atividade}?conteudo=${idConteudo}`,
                        { replace: true }
                    );
                }
            }}
        />
    );
}

function RotaProtegida({ usuario, children }) {
    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {

    const navigate = useNavigate();

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
            navigate("/login", { replace: true });
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
    }, [navigate]);

    function finalizarCadastro() {
        setUsuario(null);
        navigate("/login", { replace: true });
    }

    function finalizarLogin(usuarioAutenticado) {
        setUsuario(usuarioAutenticado);
        navigate("/aluno", { replace: true });
    }

    function selecionarAtividade(atividade, idConteudo) {
        navigate(
            `/atividades/${atividade.id_atividade}?conteudo=${idConteudo}`
        );
    }

function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    window.location.replace("/");
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
        navigate("/login", { replace: true });

        return resposta.json();
    }

        return (
        <div className="app">
            {usuario && (
                <MenuAluno
                    pagina={
                        window.location.pathname.startsWith("/atividades")
                            ? "atividades"
                            : window.location.pathname.replace("/", "")
                    }
                    onInicio={() => navigate("/aluno")}
                    onAtividades={() => navigate("/atividades")}
                    onProgresso={() => navigate("/progresso")}
                    onPerfil={() => navigate("/perfil")}
                    onSair={sair}
                />
            )}

            <Routes>
                <Route
                    path="/"
                    element={
                        usuario
                            ? <Navigate to="/aluno" replace />
                            : (
                                <Home
                                    onLogin={() => navigate("/login")}
                                    onCadastro={() => navigate("/cadastro")}
                                />
                            )
                    }
                />

                <Route
                    path="/login"
                    element={
                        usuario
                            ? <Navigate to="/aluno" replace />
                            : (
                                <Login
                                    onLogin={finalizarLogin}
                                    onCadastro={() => navigate("/cadastro")}
                                    onVoltar={() => navigate("/")}
                                    onEsqueciSenha={() => navigate("/esqueci-senha")}
                                />
                            )
                    }
                />

                <Route
                    path="/cadastro"
                    element={
                        usuario
                            ? <Navigate to="/aluno" replace />
                            : <Cadastro onCadastro={finalizarCadastro} />
                    }
                />

                <Route
                    path="/esqueci-senha"
                    element={
                        <EsqueciSenha
                            onVoltar={() => navigate("/login")}
                        />
                    }
                />

                <Route
                    path="/verificar-email"
                    element={
                        <VerificarEmail
                            onLogin={() => navigate("/login", { replace: true })}
                        />
                    }
                />

                <Route
                    path="/redefinir-senha"
                    element={
                        <RedefinirSenha
                            onLogin={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("usuario");
                                setUsuario(null);
                                navigate("/login", { replace: true });
                            }}
                        />
                    }
                />

                <Route
                    path="/confirmar-alteracao-email"
                    element={
                        <ConfirmarAlteracaoEmail
                            onLogin={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("usuario");
                                setUsuario(null);
                                navigate("/login", { replace: true });
                            }}
                        />
                    }
                />

                <Route
                    path="/aluno"
                    element={
                        <RotaProtegida usuario={usuario}>
                            <AlunoHome
                                usuario={usuario}
                                onAtividades={() => navigate("/atividades")}
                                onProgresso={() => navigate("/progresso")}
                            />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="/progresso"
                    element={
                        <RotaProtegida usuario={usuario}>
                            <Progresso
                                usuario={usuario}
                                onVoltar={() => navigate("/aluno")}
                            />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="/perfil"
                    element={
                        <RotaProtegida usuario={usuario}>
                            <Perfil
                                usuario={usuario}
                                onSalvar={atualizarPerfil}
                                onAlterarSenha={alterarSenha}
                            />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="/atividades"
                    element={
                        <RotaProtegida usuario={usuario}>
                            <Atividades
                                usuario={usuario}
                                onResolver={selecionarAtividade}
                            />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="/atividades/conteudo/:idConteudo"
                    element={
                        <RotaProtegida usuario={usuario}>
                            <Atividades
                                usuario={usuario}
                                onResolver={selecionarAtividade}
                            />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="/atividades/:id"
                    element={
                        <RotaProtegida usuario={usuario}>
                            <RotaResolverAtividade
                                usuario={usuario}
                                onVoltar={() => navigate("/atividades")}
                            />
                        </RotaProtegida>
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to={usuario ? "/aluno" : "/"}
                            replace
                        />
                    }
                />
            </Routes>
        </div>
    );
}

export default App;