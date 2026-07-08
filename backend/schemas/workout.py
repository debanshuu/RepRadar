from pydantic import BaseModel
from datetime import date, time, datetime
from typing import Optional, List

class WorkoutExerciseCreate(BaseModel):
    exercise_id: int
    sets: Optional[int] = None
    reps: Optional[int] = None
    weight: Optional[float] = None
    duration: Optional[int] = None
    notes: Optional[str] = None

class WorkoutExerciseResponse(WorkoutExerciseCreate):
    id: int
    class Config:
        from_attributes = True

class WorkoutCreate(BaseModel):
    title: str
    description: Optional[str] = None
    scheduled_date: Optional[date] = None
    scheduled_time: Optional[time] = None
    exercises: Optional[List[WorkoutExerciseCreate]] = []

class WorkoutUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    scheduled_date: Optional[date] = None
    scheduled_time: Optional[time] = None
    status: Optional[str] = None

class WorkoutResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    scheduled_date: Optional[date]
    scheduled_time: Optional[time]
    status: str
    created_at: datetime
    exercises: List[WorkoutExerciseResponse] = []

    class Config:
        from_attributes = True
