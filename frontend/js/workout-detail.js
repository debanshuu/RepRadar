requireAuth();

const params = new URLSearchParams(window.location.search);
const workoutId = params.get("id");
if (!workoutId) window.location.href = "/static/pages/workouts.html";

async function loadWorkout() {
  const [workoutRes, exercisesRes] = await Promise.all([
    getWorkout(workoutId),
    getExercises()
  ]);

  const w = await workoutRes.json();
  const allExercises = await exercisesRes.json();
  const exerciseMap = {};
  allExercises.forEach(e => exerciseMap[e.id] = e);

  document.title = `${w.title} — WorkoutTracker`;
  document.getElementById("workoutTitle").textContent = w.title;
  document.getElementById("workoutDate").textContent = formatDate(w.scheduled_date);
  document.getElementById("workoutTime").textContent = w.scheduled_time ? "· " + w.scheduled_time : "";
  document.getElementById("workoutStatus").textContent = w.status;
  document.getElementById("workoutStatus").className = `badge badge-${w.status}`;
  document.getElementById("infoStatus").textContent = w.status;
  document.getElementById("infoExercises").textContent = w.exercises.length;
  document.getElementById("infoSets").textContent = w.exercises.reduce((sum, e) => sum + (e.sets || 0), 0);

  if (w.status !== "pending") {
    document.getElementById("completeBtn").style.display = "none";
  }

  document.getElementById("exerciseTableBody").innerHTML = w.exercises.map(e => {
    const ex = exerciseMap[e.exercise_id] || {};
    return `
      <tr>
        <td>
          <div class="exercise-name">${ex.name || "Exercise #" + e.exercise_id}</div>
          <div class="exercise-muscle">${ex.muscle_group || ""}</div>
        </td>
        <td>${e.sets || "—"}</td>
        <td>${e.reps || "—"}</td>
        <td>${e.weight ? e.weight + " kg" : "—"}</td>
        <td>${e.notes || "—"}</td>
      </tr>`;
  }).join("");
}

function goEdit() {
  window.location.href = `/static/pages/edit-workout.html?id=${workoutId}`;
}

async function markComplete() {
  await completeWorkout(workoutId);
  showToast("Workout completed!");
  loadWorkout();
}

async function removeWorkout() {
  if (!confirm("Delete this workout?")) return;
  await deleteWorkout(workoutId);
  showToast("Workout deleted");
  setTimeout(() => window.location.href = "/static/pages/workouts.html", 800);
}

loadWorkout();
loadSidebarUser();
