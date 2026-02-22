const API = "http://localhost:5000/api";
const token = localStorage.getItem("token");

if (!token) location.href = "login.html";

function logout() {
  localStorage.removeItem("token");
  location.href = "login.html";
}

/* =====================
   LOAD PROFILE
===================== */
async function loadProfile() {
  try {
    const res = await fetch(`${API}/profile/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const user = await res.json();

    document.getElementById("petName").value = user.name || "";
    document.getElementById("bio").value = user.bio || "";

    if (user.profileImage) {
      document.getElementById("profileImg").src = user.profileImage;
    }
  } catch (err) {
    console.error("Failed to load profile:", err);
  }
}

/* =====================
   UPDATE PROFILE
===================== */
async function updateProfile() {
  const btn = document.querySelector(".profile-save-btn");
  const successEl = document.getElementById("success-msg");
  const errEl = document.getElementById("error-msg");

  successEl.style.display = "none";
  errEl.style.display = "none";

  btn.textContent = "Saving...";
  btn.disabled = true;

  try {
    const formData = new FormData();
    formData.append("name", document.getElementById("petName").value);
    formData.append("bio", document.getElementById("bio").value);

    const img = document.getElementById("profileImage").files[0];
    if (img) formData.append("profileImage", img);

    const res = await fetch(`${API}/profile/me`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    if (!res.ok) throw new Error("Failed");

    successEl.style.display = "block";
    loadProfile();

  } catch (err) {
    errEl.textContent = "Failed to save. Please try again.";
    errEl.style.display = "block";
  } finally {
    btn.textContent = "Save Profile";
    btn.disabled = false;
  }
}

loadProfile();