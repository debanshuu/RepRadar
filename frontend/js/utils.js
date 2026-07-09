const BASE_URL = window.location.origin;

function getToken() { return localStorage.getItem("token"); }
function setToken(t) { localStorage.setItem("token", t); }
function removeToken() { localStorage.removeItem("token"); }

function isLoggedIn() { return !!getToken(); }

function requireAuth() {
  if (!isLoggedIn()) window.location.href = "/static/pages/login.html";
}

function redirectIfLoggedIn() {
  if (isLoggedIn()) window.location.href = "/static/pages/dashboard.html";
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
    window.location.href = "/static/pages/login.html";
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
  window.location.href = "/static/pages/login.html";
}

async function loadSidebarUser() {
  try {
    const res = await api("/auth/profile");
    const user = await res.json();
    const nameEl = document.querySelector(".user-name");
    const emailEl = document.querySelector(".user-email");
    const avatarEl = document.querySelector(".avatar");
    if (nameEl) nameEl.textContent = user.name;
    if (emailEl) emailEl.textContent = user.email;
    if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();
  } catch(e) {}
}
