import { useEffect, useState } from "react";
import { buscarAnosEscolares } from "../services/api";


function Home({ onCadastro }) {
    return (
        <main className="conteudo">
        <section className="boas-vindas">
            <h2>Bem-vindo!</h2>

            <p>
            Aprenda matemática de forma interativa,
            por meio de desafios e atividades.
            </p>

            <p>
            Para começar, crie seu cadastro.
            </p>

            <button onClick={onCadastro}>
            Criar cadastro
            </button>
        </section>
        </main>
    );
}

export default Home;
