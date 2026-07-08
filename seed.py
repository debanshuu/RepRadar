import requests
from backend.database import SessionLocal
from backend.models.user import User
from backend.models.workout import Exercise
from backend.core.config import settings

MUSCLE_GROUPS = ["chest", "back", "shoulders", "biceps", "triceps", "legs", "abdominals"]

def seed():
    db = SessionLocal()
    if db.query(Exercise).count() > 0:
        print("Exercises already seeded!")
        db.close()
        return

    total = 0
    for muscle in MUSCLE_GROUPS:
        res = requests.get(
            "https://api.api-ninjas.com/v1/exercises",
            headers={"X-Api-Key": settings.EXERCISE_API_KEY},
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
            total += 1

    db.commit()
    db.close()
    print(f"Seeded {total} exercises!")

if __name__ == "__main__":
    seed()
