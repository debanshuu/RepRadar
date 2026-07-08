requireAuth();

const params = new URLSearchParams(window.location.search);
const workoutId = params.get("id");
if (!workoutId) window.location.href = "/static/pages/workouts.html";

async function loadWorkout() {
  const res = await getWorkout(workoutId);
  const w = await res.json();
  document.getElementById("title").value = w.title;
  document.getElementById("description").value = w.description || "";
  document.getElementById("scheduled_date").value = w.scheduled_date || "";
  document.getElementById("scheduled_time").value = w.scheduled_time || "";
  document.getElementById("status").value = w.status;
}

async function saveWorkout() {
  const btn = document.getElementById("saveBtn");
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;

  const payload = {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value,
    scheduled_date: document.getElementById("scheduled_date").value || null,
    scheduled_time: document.getElementById("scheduled_time").value || null,
    status: document.getElementById("status").value
  };

  if (!payload.title) {
    showToast("Enter a workout name", "error");
    btn.innerHTML = "Save changes";
    btn.disabled = false;
    return;
  }

  const res = await updateWorkout(workoutId, payload);
  if (res.ok) {
    showToast("Workout updated!");
    setTimeout(() => window.location.href = "/static/pages/workouts.html", 800);
  } else {
    const data = await res.json();
    showToast(data.detail || "Failed to update", "error");
    btn.innerHTML = "Save changes";
    btn.disabled = false;
  }
}

loadWorkout();

loadSidebarUser();
