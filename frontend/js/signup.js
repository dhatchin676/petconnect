const API = "https://petconnect-1-54kt.onrender.com/api";

async function signup() {
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const errEl = document.getElementById("error-msg");
  const btn = document.querySelector(".btn-signup");

  errEl.style.display = "none";

  if (!name || !email || !password) {
    errEl.textContent = "Please fill in all fields.";
    errEl.style.display = "block";
    return;
  }

  if (password.length < 6) {
    errEl.textContent = "Password must be at least 6 characters.";
    errEl.style.display = "block";
    return;
  }

  btn.textContent = "Creating account...";
  btn.disabled = true;

  try {
    const res = await fetch(`${API}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errEl.textContent = data.message || "Signup failed. Please try again.";
      errEl.style.display = "block";
      btn.textContent = "Create Account";
      btn.disabled = false;
      return;
    }

    window.location.href = "login.html";

  } catch (err) {
    errEl.textContent = "Server error. Please try again.";
    errEl.style.display = "block";
    btn.textContent = "Create Account";
    btn.disabled = false;
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") signup();
});