from pydantic import BaseModel, ConfigDict, Field

from app.schemas.conteudo import ConteudoResponse

from typing import Literal


class AtividadeCreate(BaseModel):
    titulo: str
    descricao: str
    nivel: str
    resposta_esperada: str
    id_ano: int
    blocos_permitidos: list[
        Literal[
            "soma",
            "subtracao",
            "multiplicacao",
            "divisao",
            "sequencia",
            "fracao"
        ]
    ] = Field(default_factory=list)
    ids_conteudos: list[int] = Field(default_factory=list)


class AtividadeResponse(BaseModel):
    id_atividade: int
    titulo: str
    descricao: str
    nivel: str
    resposta_esperada: str | None
    id_ano: int
    blocos_permitidos: list[str]
    conteudos: list[ConteudoResponse]

    model_config = ConfigDict(
        from_attributes=True
    )