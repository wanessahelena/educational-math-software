import { useEffect, useRef } from "react";
import * as Blockly from "blockly";


function registrarBlocosMatematicos() {
    if (!Blockly.Blocks["bloco_soma"]) {
        Blockly.Blocks["bloco_soma"] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("Soma:")
                    .appendField(
                        new Blockly.FieldNumber(0),
                        "VALOR_1"
                    )
                    .appendField("+")
                    .appendField(
                        new Blockly.FieldNumber(0),
                        "VALOR_2"
                    )
                    .appendField("=")
                    .appendField(
                        new Blockly.FieldNumber(0),
                        "RESULTADO"
                    );

                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(120);
                this.setTooltip("Representa uma operação de adição.");
            },
        };
    }

    if (!Blockly.Blocks["bloco_subtracao"]) {
        Blockly.Blocks["bloco_subtracao"] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("Subtração:")
                    .appendField(
                        new Blockly.FieldNumber(0),
                        "VALOR_1"
                    )
                    .appendField("-")
                    .appendField(
                        new Blockly.FieldNumber(0),
                        "VALOR_2"
                    )
                    .appendField("=")
                    .appendField(
                        new Blockly.FieldNumber(0),
                        "RESULTADO"
                    );

                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(30);
                this.setTooltip(
                    "Representa uma operação de subtração."
                );
            },
        };
    }

    if (!Blockly.Blocks["bloco_multiplicacao"]) {
        Blockly.Blocks["bloco_multiplicacao"] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("Multiplicação:")
                    .appendField(
                        new Blockly.FieldNumber(0),
                        "VALOR_1"
                    )
                    .appendField("×")
                    .appendField(
                        new Blockly.FieldNumber(0),
                        "VALOR_2"
                    )
                    .appendField("=")
                    .appendField(
                        new Blockly.FieldNumber(0),
                        "RESULTADO"
                    );

                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(210);
                this.setTooltip(
                    "Representa uma operação de multiplicação."
                );
            },
        };
    }

    if (!Blockly.Blocks["bloco_divisao"]) {
        Blockly.Blocks["bloco_divisao"] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("Divisão:")
                    .appendField(
                        new Blockly.FieldNumber(0),
                        "VALOR_1"
                    )
                    .appendField("÷")
                    .appendField(
                        new Blockly.FieldNumber(1),
                        "VALOR_2"
                    )
                    .appendField("=")
                    .appendField(
                        new Blockly.FieldNumber(0),
                        "RESULTADO"
                    );

                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(260);
                this.setTooltip(
                    "Representa uma operação de divisão."
                );
            },
        };
    }

    if (!Blockly.Blocks["bloco_sequencia"]) {
    Blockly.Blocks["bloco_sequencia"] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Sequência:")
                .appendField(
                    new Blockly.FieldNumber(0),
                    "VALOR_1"
                )
                .appendField(",")
                .appendField(
                    new Blockly.FieldNumber(0),
                    "VALOR_2"
                )
                .appendField(",")
                .appendField(
                    new Blockly.FieldNumber(0),
                    "VALOR_3"
                )
                .appendField(",")
                .appendField(
                    new Blockly.FieldNumber(0),
                    "PROXIMO"
                );

            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(180);
            this.setTooltip(
                "Representa uma sequência numérica."
            );
        },
    };
}

if (!Blockly.Blocks["bloco_fracao"]) {
    Blockly.Blocks["bloco_fracao"] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Fração:")
                .appendField(
                    new Blockly.FieldNumber(0, 0),
                    "NUMERADOR"
                )
                .appendField("/")
                .appendField(
                    new Blockly.FieldNumber(0, 0),
                    "DENOMINADOR"
                );

            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(60);
            this.setTooltip(
                "Representa uma fração por meio de numerador e denominador."
            );
        },
    };
}

    if (!Blockly.Blocks["bloco_resposta"]) {
        Blockly.Blocks["bloco_resposta"] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("Resposta:")
                    .appendField(
                        new Blockly.FieldNumber(0),
                        "RESPOSTA"
                    );

                this.setPreviousStatement(true, null);
                this.setColour(345);
                this.setTooltip(
                    "Indica a resposta final da atividade."
                );
            },
        };
    }
}


function BlocklyWorkspace({
    blocosPermitidos,
    onRespostaChange,
}) {
    const blocklyDiv = useRef(null);
    const workspaceRef = useRef(null);

    useEffect(() => {
        registrarBlocosMatematicos();

        if (!blocklyDiv.current) {
            return;
        }

        const mapaBlocos = {
            soma: "bloco_soma",
            subtracao: "bloco_subtracao",
            multiplicacao: "bloco_multiplicacao",
            divisao: "bloco_divisao",
            sequencia: "bloco_sequencia",
            fracao: "bloco_fracao",
        };

        const blocosToolbox = (blocosPermitidos || [])
            .filter((bloco) => mapaBlocos[bloco])
            .map((bloco) => ({
                kind: "block",
                type: mapaBlocos[bloco],
            }));

        const toolbox = {
            kind: "flyoutToolbox",
            contents: [
                ...blocosToolbox,
                {
                    kind: "block",
                    type: "bloco_resposta",
                },
            ],
        };

        workspaceRef.current = Blockly.inject(
            blocklyDiv.current,
            {
                toolbox: toolbox,

                trashcan: true,
                scrollbars: true,

                move: {
                    scrollbars: true,
                    drag: true,
                    wheel: true,
                },

                zoom: {
                    controls: true,
                    wheel: true,
                    startScale: 1.25,
                    maxScale: 1.8,
                    minScale: 0.8,
                    scaleSpeed: 1.1,
                },
            }
        );

        // Lê automaticamente o valor colocado
        // no bloco "Resposta".
        const atualizarResposta = () => {
            const blocos =
                workspaceRef.current.getAllBlocks(false);

            const blocosResposta = blocos.filter(
                (bloco) => bloco.type === "bloco_resposta"
            );

            if (blocosResposta.length === 0) {
                onRespostaChange("");
                return;
            }

            if (blocosResposta.length > 1) {
                onRespostaChange("");
                return;
            }

            const blocoResposta = blocosResposta[0];

            const resposta =
                blocoResposta.getFieldValue("RESPOSTA");

            onRespostaChange(String(resposta));
        };

        // Sempre que algum bloco for criado,
        // alterado, movido ou excluído,
        // verificamos novamente a resposta.
        workspaceRef.current.addChangeListener(
            atualizarResposta
        );

        return () => {
            workspaceRef.current?.removeChangeListener(
                atualizarResposta
            );

            workspaceRef.current?.dispose();
        };
    }, [blocosPermitidos, onRespostaChange]);

    function limparBlocos() {
        if (workspaceRef.current) {
            workspaceRef.current.clear();
            onRespostaChange("");
        }
    }

    
    return (
        <div className="blockly-painel">
            <div className="blockly-instrucoes">
                <h3>Área de blocos</h3>

                <p>
                    Arraste os blocos e preencha os valores
                    para representar sua resolução.
                </p>
            </div>

            <div
                ref={blocklyDiv}
                className="blockly-container"
                style={{
                    width: "100%",
                    height: "400px",
                    minHeight: "400px",
                }}
            />

            <div className="blockly-rodape">
                <button
                    type="button"
                    className="blockly-limpar"
                    onClick={limparBlocos}
                >
                    <span aria-hidden="true">↺</span>
                    Limpar blocos
                </button>
            </div>
        </div>
    );

}

export default BlocklyWorkspace;