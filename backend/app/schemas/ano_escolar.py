from pydantic import BaseModel, ConfigDict

from app.schemas.conteudo import ConteudoResponse


class AnoEscolarResponse(BaseModel):
    id_ano: int
    nome: str
    conteudos: list[ConteudoResponse]

    model_config = ConfigDict(
        from_attributes=True
    )