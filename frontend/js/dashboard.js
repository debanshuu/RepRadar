requireAuth();

async function loadDashboard() {
  const [historyRes, monthlyRes, workoutsRes] = await Promise.all([
    getHistory(), getMonthly(), getWorkouts()
  ]);

  const history = await historyRes.json();
  const monthly = await monthlyRes.json();
  const workouts = await workoutsRes.json();

  document.getElementById("statTotal").textContent = history.total_workouts;
  document.getElementById("statCompleted").textContent = history.completed;
  document.getElementById("statPending").textContent = history.pending;
  document.getElementById("statMonthly").textContent = monthly.total_workouts;

  const pending = workouts
    .filter(w => w.status === "pending")
    .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date))
    .slice(0, 4);

  const completed = workouts
    .filter(w => w.status === "completed")
    .slice(-4).reverse();

  if (pending.length) {
    document.getElementById("upcomingList").innerHTML = pending.map(w => `
      <div class="workout-item">
        <div>
          <div class="workout-name">${w.title}</div>
          <div class="workout-meta">${formatDate(w.scheduled_date)} ${w.scheduled_time ? "· " + w.scheduled_time : ""}</div>
        </div>
        <span class="badge badge-pending">Pending</span>
      </div>`).join("");
  }

  if (completed.length) {
    document.getElementById("recentList").innerHTML = completed.map(w => `
      <div class="workout-item">
        <div>
          <div class="workout-name">${w.title}</div>
          <div class="workout-meta">${formatDate(w.scheduled_date)}</div>
        </div>
        <span class="badge badge-completed">Done</span>
      </div>`).join("");
  }
}

loadDashboard();
