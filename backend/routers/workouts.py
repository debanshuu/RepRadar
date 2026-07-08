from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.workout import Workout, WorkoutExercise
from backend.models.user import User
from backend.schemas.workout import WorkoutCreate, WorkoutUpdate, WorkoutResponse
from backend.core.deps import get_current_user

router = APIRouter(prefix="/workouts", tags=["Workouts"])


@router.post("/", response_model=WorkoutResponse)
def create_workout(data: WorkoutCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    workout = Workout(
        user_id=current_user.id,
        title=data.title,
        description=data.description,
        scheduled_date=data.scheduled_date,
        scheduled_time=data.scheduled_time,
        status="pending"
    )
    db.add(workout)
    db.flush()
    for ex in data.exercises:
        db.add(WorkoutExercise(workout_id=workout.id, **ex.dict()))
    db.commit()
    db.refresh(workout)
    return workout

@router.get("/", response_model=list[WorkoutResponse])
def get_workouts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Workout).filter(Workout.user_id == current_user.id).all()

@router.get("/{id}", response_model=WorkoutResponse)
def get_workout(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    workout = db.query(Workout).filter(Workout.id == id, Workout.user_id == current_user.id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    return workout

@router.put("/{id}", response_model=WorkoutResponse)
def update_workout(id: int, data: WorkoutUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    workout = db.query(Workout).filter(Workout.id == id, Workout.user_id == current_user.id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(workout, key, value)
    db.commit()
    db.refresh(workout)
    return workout

@router.delete("/{id}")
def delete_workout(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    workout = db.query(Workout).filter(Workout.id == id, Workout.user_id == current_user.id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    db.delete(workout)
    db.commit()
    return {"message": "Workout deleted"}

@router.patch("/{id}/complete")
def complete_workout(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    workout = db.query(Workout).filter(Workout.id == id, Workout.user_id == current_user.id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    workout.status = "completed"
    db.commit()
    return {"message": "Workout marked as completed"}
