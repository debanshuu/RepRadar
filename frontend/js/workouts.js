requireAuth();
let allWorkouts = [];

async function loadWorkouts() {
  const res = await getWorkouts();
  allWorkouts = await res.json();
  renderWorkouts(allWorkouts);
}

function filterWorkouts() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const status = document.getElementById("statusFilter").value;
  const filtered = allWorkouts.filter(w => {
    const matchSearch = w.title.toLowerCase().includes(search);
    const matchStatus = !status || w.status === status;
    return matchSearch && matchStatus;
  });
  renderWorkouts(filtered);
}

function renderWorkouts(workouts) {
  const grid = document.getElementById("workoutGrid");
  if (!workouts.length) {
    grid.innerHTML = '<div class="empty-state"><h3>No workouts found</h3><p>Create one to get started</p></div>';
    return;
  }
  grid.innerHTML = workouts.map(w => `
    <div class="workout-card" onclick="window.location.href='workout-detail.html?id=${w.id}'">
      <div class="workout-card-header">
        <div>
          <div class="workout-card-title">${w.title}</div>
          <div class="workout-card-date">${formatDate(w.scheduled_date)} ${w.scheduled_time ? "· " + w.scheduled_time : ""}</div>
        </div>
        <span class="badge badge-${w.status}">${w.status}</span>
      </div>
      <div class="workout-card-desc">${w.description || "No description"}</div>
      <div class="workout-card-footer">
        <span class="exercise-count">${w.exercises.length} exercise${w.exercises.length !== 1 ? "s" : ""}</span>
        <div class="card-actions" onclick="event.stopPropagation()">
          ${w.status === "pending" ? `<button class="btn-primary btn-xs" onclick="markDone(${w.id})">Mark done</button>` : ""}
          <button class="btn-secondary btn-xs" onclick="window.location.href='edit-workout.html?id=${w.id}'">Edit</button>
          <button class="btn-danger btn-xs" onclick="removeWorkout(${w.id})">Delete</button>
        </div>
      </div>
    </div>`).join("");
}

async function markDone(id) {
  await completeWorkout(id);
  showToast("Workout completed!");
  loadWorkouts();
}

async function removeWorkout(id) {
  if (!confirm("Delete this workout?")) return;
  await deleteWorkout(id);
  showToast("Workout deleted");
  loadWorkouts();
}

loadWorkouts();
