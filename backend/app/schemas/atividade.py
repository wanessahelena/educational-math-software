from pydantic import BaseModel, ConfigDict

from app.schemas.conteudo import ConteudoResponse


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