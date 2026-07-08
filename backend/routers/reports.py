from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.database import get_db
from backend.models.workout import Workout, WorkoutExercise
from backend.models.user import User
from backend.core.deps import get_current_user
from datetime import datetime, timedelta

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/history")
def get_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    workouts = db.query(Workout).filter(Workout.user_id == current_user.id).all()
    total = len(workouts)
    completed = len([w for w in workouts if w.status == "completed"])
    pending = len([w for w in workouts if w.status == "pending"])
    cancelled = len([w for w in workouts if w.status == "cancelled"])
    return {
        "total_workouts": total,
        "completed": completed,
        "pending": pending,
        "cancelled": cancelled
    }

@router.get("/progress")
def get_progress(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    exercises = (
        db.query(
            WorkoutExercise.exercise_id,
            func.max(WorkoutExercise.weight).label("max_weight"),
            func.avg(WorkoutExercise.weight).label("avg_weight"),
            func.count(WorkoutExercise.id).label("total_sets")
        )
        .join(Workout)
        .filter(Workout.user_id == current_user.id)
        .group_by(WorkoutExercise.exercise_id)
        .all()
    )
    return [
        {
            "exercise_id": e.exercise_id,
            "max_weight": round(e.max_weight or 0, 2),
            "avg_weight": round(e.avg_weight or 0, 2),
            "total_sets": e.total_sets
        }
        for e in exercises
    ]

@router.get("/monthly")
def get_monthly(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    workouts = (
        db.query(Workout)
        .filter(Workout.user_id == current_user.id, Workout.created_at >= thirty_days_ago)
        .all()
    )
    total = len(workouts)
    completed = len([w for w in workouts if w.status == "completed"])
    return {
        "period": "last_30_days",
        "total_workouts": total,
        "completed_workouts": completed,
        "completion_rate": round((completed / total * 100) if total > 0 else 0, 1)
    }
