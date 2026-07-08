from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Text, Date, Time
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    category = Column(String)
    muscle_group = Column(String)

class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    scheduled_date = Column(Date)
    scheduled_time = Column(Time)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="workouts")
    exercises = relationship("WorkoutExercise", back_populates="workout")

class WorkoutExercise(Base):
    __tablename__ = "workout_exercises"

    id = Column(Integer, primary_key=True, index=True)
    workout_id = Column(Integer, ForeignKey("workouts.id"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    sets = Column(Integer)
    reps = Column(Integer)
    weight = Column(Float)
    duration = Column(Integer)
    notes = Column(Text)

    workout = relationship("Workout", back_populates="exercises")
    exercise = relationship("Exercise")
