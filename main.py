from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.database import Base, engine, SessionLocal
from backend.routers import auth, exercises, workouts, reports
import backend.models.user
import backend.models.workout

Base.metadata.create_all(bind=engine)

def auto_seed():
    from backend.models.workout import Exercise
    import requests
    import os
    db = SessionLocal()
    if db.query(Exercise).count() > 0:
        db.close()
        return
    api_key = os.getenv("EXERCISE_API_KEY", "")
    if not api_key:
        db.close()
        return
    muscle_groups = ["chest", "back", "shoulders", "biceps", "triceps", "legs", "abdominals"]
    for muscle in muscle_groups:
        res = requests.get(
            "https://api.api-ninjas.com/v1/exercises",
            headers={"X-Api-Key": api_key},
            params={"muscle": muscle, "limit": 10}
        )
        for e in res.json():
            equipment = ", ".join(e.get("equipments", [])) or "None"
            db.add(Exercise(
                name=e["name"],
                category=e["type"],
                muscle_group=e["muscle"],
                description=f"Equipment: {equipment}. {e['instructions'][:200]}"
            ))
    db.commit()
    db.close()

auto_seed()

app = FastAPI(title="Workout Tracker API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(exercises.router)
app.include_router(workouts.router)
app.include_router(reports.router)

app.mount("/static", StaticFiles(directory="frontend"), name="static")

@app.get("/")
def root():
    return FileResponse("frontend/pages/index.html")
