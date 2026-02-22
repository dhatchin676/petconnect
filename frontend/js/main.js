const API = "http://localhost:5000/api";
const token = localStorage.getItem("token");

if (!token) location.href = "login.html";

const localComments = {};

/* =====================
   DARK / LIGHT MODE
===================== */
function toggleTheme() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  document.getElementById("themeBtn").textContent = isDark ? "☀️" : "🌙";
}

(function () {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    const btn = document.getElementById("themeBtn");
    if (btn) btn.textContent = "☀️";
  }
})();

/* =====================
   LOGOUT
===================== */
function logout() {
  localStorage.removeItem("token");
  location.href = "login.html";
}

/* =====================
   CREATE POST
===================== */
async function createPost() {
  const text = document.getElementById("postText").value;
  const file = document.getElementById("postImage").files[0];
  if (!text && !file) return alert("Add text or media");

  const fd = new FormData();
  fd.append("text", text);
  if (file) fd.append("image", file); // backend reads this as "image" field

  await fetch(`${API}/posts`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd
  });

  document.getElementById("postText").value = "";
  document.getElementById("postImage").value = "";
  loadFeed();
}

/* =====================
   RENDER MEDIA — image or video
===================== */
function renderMedia(post) {
  if (!post.image) return "";

  // Use mediaType field if available, else guess from URL
  const isVideo = post.mediaType === "video" ||
    /\.(mp4|webm|mov|avi)(\?|$)/i.test(post.image) ||
    post.image.includes("/video/upload/");

  if (isVideo) {
    return `
      <video class="post-img" controls preload="metadata">
        <source src="${post.image}" type="video/mp4">
        Your browser does not support video.
      </video>`;
  }

  return `<img src="${post.image}" class="post-img" alt="post image">`;
}

/* =====================
   LOAD FEED
===================== */
async function loadFeed() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  const res = await fetch(`${API}/posts`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const posts = await res.json();

  posts.forEach(post => {
    localComments[post._id] = post.comments || [];
  });

  if (!posts.length) {
    feed.innerHTML = `
      <div class="empty-feed">
        <span class="icon">🐾</span>
        <h3>No posts yet</h3>
        <p>Be the first to share a pet moment!</p>
      </div>`;
    return;
  }

  posts.forEach(post => {
    const div = document.createElement("div");
    div.className = "card post";
    div.id = `post-${post._id}`;
    div.innerHTML = `
      <button class="delete-btn" onclick="deletePost('${post._id}')">🗑</button>
      <div class="post-header">
        <img class="feed-profile-img"
             src="${post.user?.profileImage || 'https://via.placeholder.com/42'}"
             alt="avatar">
        <span class="post-username">${post.user?.name || "User"}</span>
      </div>
      ${post.text ? `<p class="post-text">${post.text}</p>` : ""}
      ${renderMedia(post)}
      <div class="post-footer">
        <span id="like-${post._id}" onclick="likePost('${post._id}')">
          ❤️ <span class="like-count">${post.likes.length}</span>
        </span>
        <span onclick="openComments('${post._id}')">
          💬 <span id="comment-count-${post._id}">${post.comments.length}</span>
        </span>
      </div>
    `;
    feed.appendChild(div);
  });
}

/* =====================
   LIKE
===================== */
async function likePost(id) {
  const countEl = document.querySelector(`#like-${id} .like-count`);
  const current = parseInt(countEl.textContent);
  countEl.textContent = current + 1;

  try {
    const res = await fetch(`${API}/posts/${id}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    const updated = await res.json();
    if (updated.likes !== undefined) {
      const real = Array.isArray(updated.likes) ? updated.likes.length : updated.likes;
      countEl.textContent = real;
    }
  } catch {
    countEl.textContent = current;
  }
}

/* =====================
   DELETE
===================== */
async function deletePost(id) {
  if (!confirm("Delete this post?")) return;
  document.getElementById(`post-${id}`)?.remove();
  await fetch(`${API}/posts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
}

/* =====================
   OPEN COMMENTS
===================== */
function openComments(postId) {
  const panel = document.getElementById("commentPanel");
  panel.classList.add("open");
  panel.dataset.postId = postId;

  if (!localComments[postId]) localComments[postId] = [];
  renderCommentList(postId);

  setTimeout(() => document.getElementById("commentInput").focus(), 300);
}

function closeComments() {
  document.getElementById("commentPanel").classList.remove("open");
}

/* =====================
   RENDER COMMENTS
===================== */
function renderCommentList(postId) {
  const list = document.getElementById("commentList");
  const comments = localComments[postId] || [];

  list.innerHTML = "";

  if (!comments.length) {
    list.innerHTML = `
      <div class="no-comments">
        <span>💬</span>
        <p>No comments yet</p>
        <small>Be the first to comment</small>
      </div>`;
    return;
  }

  comments.forEach(c => {
    const name = c.user?.name || c.name || "User";
    const el = document.createElement("div");
    el.className = "comment-item";
    el.innerHTML = `
      <div class="comment-avatar">${name[0].toUpperCase()}</div>
      <div class="comment-body">
        <span class="comment-username">${name}</span>
        <span class="comment-text">${c.text}</span>
      </div>
    `;
    list.appendChild(el);
  });

  list.scrollTop = list.scrollHeight;
}

/* =====================
   SEND COMMENT
===================== */
async function sendComment() {
  const panel = document.getElementById("commentPanel");
  const postId = panel.dataset.postId;
  const input = document.getElementById("commentInput");
  const sendBtn = document.getElementById("sendCommentBtn");
  const text = input.value.trim();

  if (!text) return;

  if (!localComments[postId]) localComments[postId] = [];
  localComments[postId].push({ text, user: { name: "You" } });
  renderCommentList(postId);

  const countEl = document.getElementById(`comment-count-${postId}`);
  if (countEl) countEl.textContent = parseInt(countEl.textContent) + 1;

  input.value = "";
  sendBtn.disabled = true;
  sendBtn.textContent = "...";

  try {
    await fetch(`${API}/posts/${postId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    });

    const res = await fetch(`${API}/posts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const posts = await res.json();
    const post = posts.find(p => p._id === postId);

    if (post) {
      localComments[postId] = post.comments;
      const freshCount = document.getElementById(`comment-count-${postId}`);
      if (freshCount) freshCount.textContent = post.comments.length;
      renderCommentList(postId);
    }

  } catch (err) {
    console.error("Comment failed:", err);
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "Post";
    input.focus();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("commentInput");
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendComment();
      }
    });
  }
});

/* =====================
   INIT
===================== */
loadFeed();