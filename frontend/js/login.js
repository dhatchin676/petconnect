const API = "https://petconnect-1-54kt.onrender.com/api";

async function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const errEl = document.getElementById("error-msg");
  const btn = document.querySelector(".btn-login");

  errEl.style.display = "none";

  if (!email || !password) {
    errEl.textContent = "Please fill in all fields.";
    errEl.style.display = "block";
    return;
  }

  btn.textContent = "Logging in...";
  btn.disabled = true;

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errEl.textContent = data.message || "Login failed. Please try again.";
      errEl.style.display = "block";
      btn.textContent = "Login";
      btn.disabled = false;
      return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";

  } catch (err) {
    errEl.textContent = "Server error. Please try again.";
    errEl.style.display = "block";
    btn.textContent = "Login";
    btn.disabled = false;
  }
}

function resetPassword() {
  alert("Reset link sent! Check your email.");
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") login();
});