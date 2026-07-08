async function register(name, email, password) {
  return await api("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

async function login(email, password) {
  return await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

async function getProfile() {
  return await api("/auth/profile");
}

async function getExercises() {
  return await api("/exercises/");
}

async function getWorkouts() {
  return await api("/workouts/");
}

async function getWorkout(id) {
  return await api(`/workouts/${id}`);
}

async function createWorkout(data) {
  return await api("/workouts/", { method: "POST", body: JSON.stringify(data) });
}

async function updateWorkout(id, data) {
  return await api(`/workouts/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

async function deleteWorkout(id) {
  return await api(`/workouts/${id}`, { method: "DELETE" });
}

async function completeWorkout(id) {
  return await api(`/workouts/${id}/complete`, { method: "PATCH" });
}

async function getHistory() {
  return await api("/reports/history");
}

async function getMonthly() {
  return await api("/reports/monthly");
}

async function getProgress() {
  return await api("/reports/progress");
}
