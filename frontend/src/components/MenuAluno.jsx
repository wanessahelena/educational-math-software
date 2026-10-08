
function MenuAluno({ pagina, onInicio, onAtividades, onProgresso, onSair }) {
    return (
        <header className="menu-matelogica">
            <div className="menu-matelogica-container">
                <div className="menu-matelogica-marca">
                    <span className="menu-matelogica-logo" aria-hidden="true">
                        ✦
                    </span>
                    <span>
                        Mate<span className="menu-matelogica-verde">lógica</span>
                    </span>
                </div>

                <nav className="menu-matelogica-links" aria-label="Navegação do aluno">
                    <button
                        type="button"
                        className={pagina === "aluno" ? "menu-link-ativo" : ""}
                        onClick={onInicio}
                        aria-current={pagina === "aluno" ? "page" : undefined}
                    >
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
                        Atividades
                    </button>

                    <button
                        type="button"
                        className={pagina === "progresso" ? "menu-link-ativo" : ""}
                        onClick={onProgresso}
                        aria-current={pagina === "progresso" ? "page" : undefined}
                    >
                        Meu progresso
                    </button>

                    <button
                        type="button"
                        className="menu-matelogica-sair"
                        onClick={onSair}
                    >
                        Sair
                    </button>
                </nav>
            </div>
        </header>
    );
}

export default MenuAluno;
