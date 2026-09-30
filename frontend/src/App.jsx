import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Cadastro from "./pages/Cadastro";
import AlunoHome from "./pages/AlunoHome";
import Atividades from "./pages/Atividades";
import ResolverAtividade from "./pages/ResolverAtividade";

function App() {
  const [pagina, setPagina] = useState("home");
  const [usuario, setUsuario] = useState(null);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);

  function finalizarCadastro(novoUsuario) {
    setUsuario(novoUsuario);
    setPagina("aluno");
  }

  function selecionarAtividade(atividade) {
    setAtividadeSelecionada(atividade);
    setPagina("resolver");
  }

  return (
    <div className="app">
      <Header />

      {pagina === "home" && (
        <Home onCadastro={() => setPagina("cadastro")} />
      )}

      {pagina === "cadastro" && (
        <Cadastro onCadastro={finalizarCadastro} />
      )}

      {pagina === "aluno" && usuario && (
        <AlunoHome
          usuario={usuario}
          onAtividades={() => setPagina("atividades")}
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