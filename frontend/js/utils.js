const BASE_URL = "http://127.0.0.1:8000";

function getToken() { return localStorage.getItem("token"); }
function setToken(t) { localStorage.setItem("token", t); }
function removeToken() { localStorage.removeItem("token"); }

function isLoggedIn() { return !!getToken(); }

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = "/frontend/pages/login.html";
  }
}

function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.href = "/frontend/pages/dashboard.html";
  }
}

async function api(endpoint, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401) {
    removeToken();
    window.location.href = "/frontend/pages/login.html";
    return;
  }
  return res;
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function logout() {
  removeToken();
  window.location.href = "/frontend/pages/login.html";
}
