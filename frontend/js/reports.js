requireAuth();

async function loadReports() {
  const [historyRes, monthlyRes, progressRes, exercisesRes] = await Promise.all([
    getHistory(), getMonthly(), getProgress(), getExercises()
  ]);

  const history = await historyRes.json();
  const monthly = await monthlyRes.json();
  const progress = await progressRes.json();
  const allExercises = await exercisesRes.json();
  const exerciseMap = {};
  allExercises.forEach(e => exerciseMap[e.id] = e);

  document.getElementById("totalWorkouts").textContent = history.total_workouts;
  document.getElementById("totalCompleted").textContent = history.completed;
  document.getElementById("completionRate").textContent =
    history.total_workouts ? Math.round((history.completed / history.total_workouts) * 100) + "%" : "0%";

  document.getElementById("monthlyTotal").textContent = monthly.total_workouts;
  document.getElementById("monthlyCompleted").textContent = monthly.completed_workouts;
  document.getElementById("monthlyRate").textContent = monthly.completion_rate + "%";

  if (progress.length) {
    document.getElementById("progressList").innerHTML = progress.map(p => {
      const ex = exerciseMap[p.exercise_id] || {};
      return `
        <div class="progress-row">
          <div>
            <div class="progress-name">${ex.name || "Exercise #" + p.exercise_id}</div>
            <div style="font-size:12px;color:var(--text-muted)">${ex.muscle_group || ""}</div>
          </div>
          <div class="progress-stats">
            <div class="progress-stat">
              <div class="progress-stat-label">Max weight</div>
              <div class="progress-stat-value">${p.max_weight} kg</div>
            </div>
            <div class="progress-stat">
              <div class="progress-stat-label">Avg weight</div>
              <div class="progress-stat-value">${p.avg_weight} kg</div>
            </div>
            <div class="progress-stat">
              <div class="progress-stat-label">Total sets</div>
              <div class="progress-stat-value">${p.total_sets}</div>
            </div>
          </div>
        </div>`;
    }).join("");
  }
}

loadReports();
loadSidebarUser();
