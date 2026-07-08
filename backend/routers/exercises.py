from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.workout import Exercise

router = APIRouter(prefix="/exercises", tags=["Exercises"])

@router.get("/")
def get_exercises(db: Session = Depends(get_db)):
    return db.query(Exercise).all()

@router.get("/{id}")
def get_exercise(id: int, db: Session = Depends(get_db)):
    return db.query(Exercise).filter(Exercise.id == id).first()
