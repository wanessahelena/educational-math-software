import { useEffect, useState } from "react";
import { buscarAtividadesPorAno } from "../services/api";

function Atividades({ usuario, onResolver }) {
    const [atividades, setAtividades] = useState([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        buscarAtividadesPorAno(usuario.id_ano)
        .then((dados) => {
            setAtividades(dados);
        })
        .catch((error) => {
            setErro(error.message);
        });
    }, [usuario.id_ano]);

    return (
        <main className="conteudo">
            <section className="boas-vindas">
            <h2>Atividades</h2>

            <p>
                Atividades do {usuario.ano_escolar}
            </p>

            {erro && <p>{erro}</p>}

            {atividades.length === 0 && !erro && (
                <p>Carregando atividades...</p>
            )}

            {atividades.map((atividade) => (
                <div key={atividade.id_atividade}>
                <h3>{atividade.titulo}</h3>

                <p>{atividade.descricao}</p>

                <p>
                    Nível: {atividade.nivel}
                    </p>

                    <button
                    onClick={() => onResolver(atividade)}
                    >
                    Resolver atividade
                    </button>

                    <hr />
                </div>
                ))}
            </section>
            </main>
    );
}

export default Atividades;