from pydantic import BaseModel, ConfigDict


class ConteudoResponse(BaseModel):
    id_conteudo: int
    nome: str
    descricao: str | None

    model_config = ConfigDict(
        from_attributes=True
    )