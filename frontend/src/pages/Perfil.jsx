
import { useState } from "react";

import {
    UserRound,
    Mail,
    GraduationCap,
    Save,
    LockKeyhole,
    Eye,
    EyeOff
} from "lucide-react";

function Perfil({ usuario, onSalvar, onAlterarSenha }) {
    const [nome, setNome] = useState(usuario.nome || "");
    const [email, setEmail] = useState(usuario.email || "");
    const [idAno, setIdAno] = useState(usuario.id_ano || 1);
    const [salvando, setSalvando] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [alterandoSenha, setAlterandoSenha] = useState(false);
    const [erroSenha, setErroSenha] = useState("");
    const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
    const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

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

    async function enviarAlteracaoSenha(evento) {
        evento.preventDefault();
        setErroSenha("");

        if (novaSenha !== confirmarSenha) {
            setErroSenha("As novas senhas não coincidem.");
            return;
        }

        if (novaSenha.length < 8) {
            setErroSenha("A nova senha deve ter pelo menos 8 caracteres.");
            return;
        }

        setAlterandoSenha(true);

        try {
            await onAlterarSenha({
                senha_atual: senhaAtual,
                nova_senha: novaSenha
            });
        } catch (erroAlteracao) {
            setErroSenha(erroAlteracao.message);
        } finally {
            setAlterandoSenha(false);
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

            <section className="perfil-cartao">
                <div className="perfil-apresentacao">
                    <h2>Alterar senha</h2>
                    <p>
                        Para sua segurança, informe a senha atual
                        e escolha uma nova senha.
                    </p>
                </div>

                <form
                    className="perfil-formulario"
                    onSubmit={enviarAlteracaoSenha}
                >
                    <label htmlFor="senha-atual">
                        <LockKeyhole size={18} aria-hidden="true" />
                        Senha atual
                    </label>

                    <div className="campo-senha">

                        <input
                            id="senha-atual"
                            type={mostrarSenhaAtual ? "text" : "password"}
                            autoComplete="current-password"
                            value={senhaAtual}
                            onChange={(evento) => setSenhaAtual(evento.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="botao-visualizar-senha"
                            onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                            aria-label={mostrarSenhaAtual ? "Ocultar senha atual" : "Mostrar senha atual"}
                        >
                            {mostrarSenhaAtual ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>

                    </div>

                    <label htmlFor="nova-senha">
                        <LockKeyhole size={18} aria-hidden="true" />
                        Nova senha
                    </label>

                    <div className="campo-senha">

                        <input
                            id="nova-senha"
                            type={mostrarNovaSenha ? "text" : "password"}
                            autoComplete="new-password"
                            minLength={8}
                            value={novaSenha}
                            onChange={(evento) => setNovaSenha(evento.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="botao-visualizar-senha"
                            onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                            aria-label={mostrarNovaSenha ? "Ocultar nova senha" : "Mostrar nova senha"}
                        >
                            {mostrarNovaSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>

                    </div>

                    <label htmlFor="confirmar-senha">
                        <LockKeyhole size={18} aria-hidden="true" />
                        Confirmar nova senha
                    </label>

                    <div className="campo-senha">
                        <input
                            id="confirmar-senha"
                            type={mostrarConfirmacao ? "text" : "password"}
                            autoComplete="new-password"
                            value={confirmarSenha}
                            onChange={(evento) => setConfirmarSenha(evento.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="botao-visualizar-senha"
                            onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}
                            aria-label={mostrarConfirmacao ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
                        >
                            {mostrarConfirmacao ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        
                    </div>

                    {erroSenha && (
                        <p role="alert">{erroSenha}</p>
                    )}

                    <button type="submit" disabled={alterandoSenha}>
                        <LockKeyhole size={18} aria-hidden="true" />
                        {alterandoSenha ? "Alterando..." : "Alterar senha"}
                    </button>
                </form>
            </section>

        </main>
    );
}

export default Perfil;
