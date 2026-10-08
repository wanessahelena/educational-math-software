
import { useState } from "react";

import { UserRound, Mail, GraduationCap, Save } from "lucide-react";

function Perfil({ usuario, onSalvar }) {
    const [nome, setNome] = useState(usuario.nome || "");
    const [email, setEmail] = useState(usuario.email || "");
    const [idAno, setIdAno] = useState(usuario.id_ano || 1);
    const [salvando, setSalvando] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    async function enviarFormulario(evento) {
        evento.preventDefault();

        setMensagem("");
        setErro("");
        setSalvando(true);

        try {
            await onSalvar({
                nome: nome.trim(),
                email: email.trim(),
                id_ano: Number(idAno)
            });

            setMensagem("Perfil atualizado com sucesso!");
        } catch (erroAtualizacao) {
            setErro(erroAtualizacao.message);
        } finally {
            setSalvando(false);
        }
    }

    return (
        <main className="perfil-pagina">
            <section className="perfil-cartao">
                <div className="perfil-apresentacao">
                    <h1>Meu perfil</h1>
                    <p>
                        Aqui você pode atualizar seus dados
                        e escolher seu ano escolar.
                    </p>
                </div>

                <form
                    className="perfil-formulario"
                    onSubmit={enviarFormulario}
                >
                    <label htmlFor="perfil-nome">
                        <UserRound size={18} aria-hidden="true" />
                        Nome
                    </label>
                    <input
                        id="perfil-nome"
                        type="text"
                        value={nome}
                        onChange={(evento) =>
                            setNome(evento.target.value)
                        }
                        required
                    />

                    <label htmlFor="perfil-email">
                        <Mail size={18} aria-hidden="true" />
                        E-mail
                    </label>

                    <input
                        id="perfil-email"
                        type="email"
                        value={email}
                        onChange={(evento) =>
                            setEmail(evento.target.value)
                        }
                        required
                    />

                    <label htmlFor="perfil-ano">
                        <GraduationCap size={18} aria-hidden="true" />
                        Ano escolar
                    </label>
                    <select
                        id="perfil-ano"
                        value={idAno}
                        onChange={(evento) =>
                            setIdAno(Number(evento.target.value))
                        }
                    >
                        {[1, 2, 3, 4, 5].map((ano) => (
                            <option key={ano} value={ano}>
                                {ano}º ano
                            </option>
                        ))}
                    </select>

                    {mensagem && (
                        <p role="status">{mensagem}</p>
                    )}

                    {erro && (
                        <p role="alert">{erro}</p>
                    )}

                        <button type="submit" disabled={salvando}>
                            {salvando ? (
                                "Salvando..."
                            ) : (
                                <>
                                    <Save size={18} aria-hidden="true" />
                                    Salvar alterações
                                </>
                            )}
                        </button>

                </form>
            </section>
        </main>
    );
}

export default Perfil;
