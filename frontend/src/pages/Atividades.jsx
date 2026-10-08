
import { useEffect, useState } from "react";
import {
    buscarAtividadesPorAno,
    buscarConteudosPorAno,
} from "../services/api";

function Atividades({ usuario, onResolver }) {
    const [atividades, setAtividades] = useState([]);
    const [conteudos, setConteudos] = useState([]);
    const [conteudoSelecionado, setConteudoSelecionado] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativo = true;

        async function carregarDados() {
            setCarregando(true);
            setErro("");
            setConteudoSelecionado(null);

            try {
                const [respostaAtividades, respostaConteudos] =
                    await Promise.all([
                        buscarAtividadesPorAno(usuario.id_ano),
                        buscarConteudosPorAno(usuario.id_ano),
                    ]);

                if (ativo) {
                    setAtividades(respostaAtividades);
                    setConteudos(respostaConteudos);
                }
            } catch (error) {
                if (ativo) {
                    setErro(error.message);
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        carregarDados();

        return () => {
            ativo = false;
        };
    }, [usuario.id_ano]);

    const atividadesFiltradas = atividades.filter((atividade) =>
        atividade.conteudos?.some(
            (conteudo) =>
                conteudo.id_conteudo === conteudoSelecionado
        )
    );

    return (
        <main className="conteudo">
            <section className="boas-vindas">
                <h2>Atividades</h2>
                <p>Atividades do {usuario.ano_escolar}</p>

                {carregando && <p>Carregando conteúdos...</p>}

                {erro && <p role="alert">{erro}</p>}

                {!carregando && !erro && (
                    <>
                        {conteudoSelecionado === null ? (
                            <>
                                <h3>Escolha um conteúdo matemático</h3>

                                {conteudos.length === 0 && (
                                    <p>
                                        Nenhum conteúdo disponível
                                        para este ano escolar.
                                    </p>
                                )}

                                {conteudos.map((conteudo) => (
                                    <div 
                                        key={conteudo.id_conteudo}
                                        className="card-conteudo"
                                    >
                                        <h3>{conteudo.nome}</h3>

                                        <p>{conteudo.descricao}</p>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setConteudoSelecionado(
                                                    conteudo.id_conteudo
                                                )
                                            }
                                        >
                                            Ver atividades
                                        </button>

                                        
                                    </div>
                                ))}
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="botao-voltar"
                                    onClick={() =>
                                        setConteudoSelecionado(null)
                                    }
                                >
                                    Voltar aos conteúdos
                                </button>

                                <h3>
                                    {
                                        conteudos.find(
                                            (conteudo) =>
                                                conteudo.id_conteudo ===
                                                conteudoSelecionado
                                        )?.nome
                                    }
                                </h3>

                                {atividadesFiltradas.length === 0 && (
                                    <p>
                                        Ainda não há atividades disponíveis
                                        para este conteúdo.
                                    </p>
                                )}

                                {atividadesFiltradas.map((atividade) => (
                                    <div key={atividade.id_atividade}>
                                        <h3>{atividade.titulo}</h3>
                                        <p>{atividade.descricao}</p>
                                        <p>Nível: {atividade.nivel}</p>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onResolver(atividade)
                                            }
                                        >
                                            Resolver atividade
                                        </button>

                                        <hr />
                                    </div>
                                ))}
                            </>
                        )}
                    </>
                )}
            </section>
        </main>
    );
}

export default Atividades;
