
import { useEffect, useState } from "react";
import {
    buscarAtividadesPorAno,
    buscarConteudosPorAno,
} from "../services/api";

const coresConteudos = [
    "azul",
    "verde",
    "amarelo",
    "coral",
];

const iconesConteudos = ["+", "−", "×", "÷", "123", "½", "0,5", "📏", "◇", "▥", "%", "R$"];

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
            (conteudo) => conteudo.id_conteudo === conteudoSelecionado
        )
    );

    const conteudoAtual = conteudos.find(
        (conteudo) => conteudo.id_conteudo === conteudoSelecionado
    );

    return (
        <main className="pagina-atividades">
            <div className="atividades-container">
                <header className="atividades-apresentacao">


                    <h1>
                        {conteudoAtual
                            ? conteudoAtual.nome
                            : "Explore os conteúdos"}
                    </h1>

                    <p>
                        {conteudoAtual
                            ? "Escolha um desafio para começar."
                            : "Escolha um conteúdo matemático e descubra novos desafios."}
                    </p>

                    <span className="atividades-ano">
                        📚 {usuario.ano_escolar || `${usuario.id_ano}º ano`}
                    </span>
                </header>

                {carregando && (
                    <div className="atividades-estado" role="status">
                        Carregando conteúdos...
                    </div>
                )}

                {erro && (
                    <div className="atividades-estado atividades-erro" role="alert">
                        {erro}
                    </div>
                )}

                {!carregando && !erro && (
                    <>
                        {conteudoSelecionado === null ? (
                            <section className="atividades-secao">
                                <div className="atividades-secao-titulo">
                                    <h2>O que você quer estudar?</h2>
                                    <p>Escolha um dos conteúdos abaixo.</p>
                                </div>

                                {conteudos.length === 0 ? (
                                    <div className="atividades-estado">
                                        Nenhum conteúdo disponível para este ano escolar.
                                    </div>
                                ) : (
                                    <div className="atividades-grade">
                                        {conteudos.map((conteudo, index) => {
                                            const cor = coresConteudos[index % coresConteudos.length];
                                            const icone = iconesConteudos[
                                                (conteudo.id_conteudo - 1) % iconesConteudos.length
                                            ];

                                            return (
                                                <article
                                                    key={conteudo.id_conteudo}
                                                    className={`atividades-cartao atividades-cor-${cor}`}
                                                >
                                                    <div
                                                        className="atividades-icone"
                                                        aria-hidden="true"
                                                    >
                                                        {icone}
                                                    </div>

                                                    <h3>{conteudo.nome}</h3>

                                                    <p>
                                                        {conteudo.descricao ||
                                                            "Explore desafios deste conteúdo."}
                                                    </p>

                                                    <button
                                                        type="button"
                                                        className="atividades-botao"
                                                        onClick={() =>
                                                            setConteudoSelecionado(
                                                                conteudo.id_conteudo
                                                            )
                                                        }
                                                    >
                                                        Ver atividades
                                                        <span aria-hidden="true">→</span>
                                                    </button>
                                                </article>
                                            );
                                        })}
                                    </div>
                                )}
                            </section>
                        ) : (
                            <section className="atividades-secao">
                                <button
                                    type="button"
                                    className="atividades-voltar"
                                    onClick={() => setConteudoSelecionado(null)}
                                >
                                    ← Voltar aos conteúdos
                                </button>

                                <div className="atividades-secao-titulo">
                                    <h2>Desafios disponíveis</h2>
                                    <p>
                                        Resolva as atividades e pratique o que aprendeu.
                                    </p>
                                </div>

                                {atividadesFiltradas.length === 0 ? (
                                    <div className="atividades-estado">
                                        Ainda não há atividades disponíveis para este conteúdo.
                                    </div>
                                ) : (
                                    <div className="atividades-grade">
                                        {atividadesFiltradas.map((atividade, index) => {
                                            const cor = coresConteudos[index % coresConteudos.length];

                                            return (
                                                <article
                                                    key={atividade.id_atividade}
                                                    className={`atividades-cartao atividades-cor-${cor}`}
                                                >
                                                    <div className="atividades-cartao-topo">
                                                        <span className="atividades-numero">
                                                            Desafio {index + 1}
                                                        </span>

                                                        <span className="atividades-nivel">
                                                            {atividade.nivel}
                                                        </span>
                                                    </div>

                                                    <h3>{atividade.titulo}</h3>

                                                    <p>{atividade.descricao}</p>

                                                    <button
                                                        type="button"
                                                        className="atividades-botao"
                                                        onClick={() => onResolver(atividade)}
                                                    >
                                                        Resolver atividade
                                                        <span aria-hidden="true">→</span>
                                                    </button>
                                                </article>
                                            );
                                        })}
                                    </div>
                                )}
                            </section>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}

export default Atividades;
