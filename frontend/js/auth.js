async function handleLogin() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const btn = document.getElementById("loginBtn");
  if (!email || !password) return showToast("Fill in all fields", "error");
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;
  const res = await login(email, password);
  const data = await res.json();
  if (res.ok) {
    setToken(data.access_token);
    window.location.href = "dashboard.html";
  } else {
    showToast(data.detail || "Login failed", "error");
    btn.innerHTML = "Log in";
    btn.disabled = false;
  }
}

async function handleRegister() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const btn = document.getElementById("registerBtn");
  if (!name || !email || !password) return showToast("Fill in all fields", "error");
  if (password.length < 8) return showToast("Password must be at least 8 characters", "error");
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;
  const res = await register(name, email, password);
  const data = await res.json();
  if (res.ok) {
    showToast("Account created! Logging you in...");
    const loginRes = await login(email, password);
    const loginData = await loginRes.json();
    setToken(loginData.access_token);
    window.location.href = "dashboard.html";
  } else {
    showToast(data.detail || "Registration failed", "error");
    btn.innerHTML = "Create account";
    btn.disabled = false;
  }
}

document.addEventListener("keydown", e => { if (e.key === "Enter") {
  if (document.getElementById("loginBtn")) handleLogin();
  if (document.getElementById("registerBtn")) handleRegister();
}});
