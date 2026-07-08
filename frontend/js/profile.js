requireAuth();

async function loadProfile() {
  const res = await getProfile();
  const user = await res.json();
  document.getElementById("name").value = user.name;
  document.getElementById("email").value = user.email;
  document.getElementById("memberSince").value = formatDate(user.created_at);
}

function changePassword() {
  const newPw = document.getElementById("newPassword").value;
  const confirmPw = document.getElementById("confirmPassword").value;
  if (!newPw || !confirmPw) return showToast("Fill in both fields", "error");
  if (newPw.length < 8) return showToast("Password must be at least 8 characters", "error");
  if (newPw !== confirmPw) return showToast("Passwords don't match", "error");
  showToast("Password update coming in v2!", "error");
}

loadProfile();

loadSidebarUser();
