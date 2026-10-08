
import {
    Sparkles,
    House,
    BookOpen,
    ChartNoAxesColumn,
    UserRound,
    LogOut
} from "lucide-react";

function MenuAluno({
    pagina,
    onInicio,
    onAtividades,
    onProgresso,
    onPerfil,
    onSair
}) {
    return (
        <header className="menu-matelogica">
            <div className="menu-matelogica-container">
                <div className="menu-matelogica-marca">
                    <span className="menu-matelogica-logo" aria-hidden="true">
                        <Sparkles size={26} strokeWidth={2.5} />
                    </span>
                    <span>
                        Mate<span className="menu-matelogica-verde">lógica</span>
                    </span>
                </div>

                <nav
                    className="menu-matelogica-links"
                    aria-label="Navegação do aluno"
                >
                    <button
                        type="button"
                        className={pagina === "aluno" ? "menu-link-ativo" : ""}
                        onClick={onInicio}
                        aria-current={pagina === "aluno" ? "page" : undefined}
                    >
                        <House size={18} aria-hidden="true" />
                        Início
                    </button>

                    <button
                        type="button"
                        className={
                            pagina === "atividades" || pagina === "resolver"
                                ? "menu-link-ativo"
                                : ""
                        }
                        onClick={onAtividades}
                        aria-current={
                            pagina === "atividades" || pagina === "resolver"
                                ? "page"
                                : undefined
                        }
                    >
                        <BookOpen size={18} aria-hidden="true" />
                        Atividades
                    </button>

                    <button
                        type="button"
                        className={pagina === "progresso" ? "menu-link-ativo" : ""}
                        onClick={onProgresso}
                        aria-current={pagina === "progresso" ? "page" : undefined}
                    >
                        <ChartNoAxesColumn size={18} aria-hidden="true" />
                        Meu progresso
                    </button>

                    <button
                        type="button"
                        className={pagina === "perfil" ? "menu-link-ativo" : ""}
                        onClick={onPerfil}
                        aria-current={pagina === "perfil" ? "page" : undefined}
                    >
                        <UserRound size={18} aria-hidden="true" />
                        Meu perfil
                    </button>

                    <button
                        type="button"
                        className="menu-matelogica-sair"
                        onClick={onSair}
                    >
                        <LogOut size={18} aria-hidden="true" />
                        Sair
                    </button>
                </nav>
            </div>
        </header>
    );
}

export default MenuAluno;
