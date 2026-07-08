requireAuth();
let exercises = [];
let selectedExercises = [];

async function init() {
  const res = await getExercises();
  exercises = await res.json();
}

function openModal() {
  document.getElementById("modal").style.display = "flex";
  document.getElementById("exerciseSearch").value = "";
  renderExerciseOptions(exercises);
  document.getElementById("exerciseSearch").focus();
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function filterExercises(query) {
  const filtered = exercises.filter(e =>
    e.name.toLowerCase().includes(query.toLowerCase()) ||
    e.muscle_group.toLowerCase().includes(query.toLowerCase())
  );
  renderExerciseOptions(filtered);
}

function renderExerciseOptions(list) {
  document.getElementById("exerciseList").innerHTML = list.map(e => `
    <div class="exercise-option" onclick="selectExercise(${e.id}, '${e.name}', '${e.muscle_group}')">
      <div class="exercise-option-name">${e.name}</div>
      <div class="exercise-option-meta">${e.muscle_group} · ${e.category}</div>
    </div>`).join("");
}

function selectExercise(id, name, muscle) {
  selectedExercises.push({ exercise_id: id, name, muscle, sets: 3, reps: 10, weight: 0, notes: "" });
  renderExerciseRows();
  closeModal();
}

function removeExercise(index) {
  selectedExercises.splice(index, 1);
  renderExerciseRows();
}

function updateExercise(index, field, value) {
  selectedExercises[index][field] = field === "notes" ? value : Number(value);
}

function renderExerciseRows() {
  document.getElementById("exerciseRows").innerHTML = selectedExercises.map((ex, i) => `
    <div class="exercise-row">
      <div class="exercise-row-header">
        <div class="exercise-row-title">${ex.name} <span style="color:var(--text-muted);font-size:12px">· ${ex.muscle}</span></div>
        <button class="btn-danger btn-xs" onclick="removeExercise(${i})">Remove</button>
      </div>
      <div class="exercise-fields">
        <div class="form-group">
          <label>Sets</label>
          <input type="number" value="${ex.sets}" onchange="updateExercise(${i}, 'sets', this.value)" min="1"/>
        </div>
        <div class="form-group">
          <label>Reps</label>
          <input type="number" value="${ex.reps}" onchange="updateExercise(${i}, 'reps', this.value)" min="1"/>
        </div>
        <div class="form-group">
          <label>Weight (kg)</label>
          <input type="number" value="${ex.weight}" onchange="updateExercise(${i}, 'weight', this.value)" min="0"/>
        </div>
        <div class="form-group">
          <label>Notes</label>
          <input type="text" value="${ex.notes}" onchange="updateExercise(${i}, 'notes', this.value)" placeholder="Optional"/>
        </div>
      </div>
    </div>`).join("");
}

async function saveWorkout() {
  const title = document.getElementById("title").value.trim();
  if (!title) return showToast("Enter a workout name", "error");
  if (!selectedExercises.length) return showToast("Add at least one exercise", "error");

  const btn = document.getElementById("saveBtn");
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;

  const payload = {
    title,
    description: document.getElementById("description").value,
    scheduled_date: document.getElementById("scheduled_date").value || null,
    scheduled_time: document.getElementById("scheduled_time").value || null,
    exercises: selectedExercises.map(({ exercise_id, sets, reps, weight, notes }) => ({
      exercise_id, sets, reps, weight, notes
    }))
  };

  const res = await createWorkout(payload);
  if (res.ok) {
    showToast("Workout created!");
    setTimeout(() => window.location.href = "workouts.html", 800);
  } else {
    const data = await res.json();
    showToast(data.detail || "Failed to save", "error");
    btn.innerHTML = "Save workout";
    btn.disabled = false;
  }
}

init();

loadSidebarUser();
