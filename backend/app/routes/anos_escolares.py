from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.ano_escolar import AnoEscolar


router = APIRouter(
    prefix="/anos-escolares",
    tags=["Anos Escolares"]
)


@router.get("/")
def listar_anos_escolares(db: Session = Depends(get_db)):
    return db.query(AnoEscolar).order_by(AnoEscolar.id_ano).all()