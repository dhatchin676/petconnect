const API_URL = "http://localhost:5000/api/auth";

/* ================= SIGNUP ================= */
async function signup(event) {
  event.preventDefault();

  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Signup successful. Please login.");
    window.location.href = "login.html";

  } catch (error) {
    alert("Something went wrong");
  }
}

/* ================= LOGIN ================= */
async function login(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    // Save token
    localStorage.setItem("token", data.token);

    alert("Login successful");
    window.location.href = "dashboard.html";

  } catch (error) {
    alert("Something went wrong");
  }
}
