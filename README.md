# 🐾 PetConnect

A full-stack social platform for pet owners — create a profile for your pet, share photos and videos, like and comment on posts, and connect with a community that gets it.

**Live Demo:** [petconnect-app.netlify.app](https://petconnect-app.netlify.app)

---

## Features

- JWT authentication — secure signup and login
- Create posts with images and videos (uploaded to Cloudinary)
- Like and comment on posts in real time
- Pet profile with custom photo and bio
- Dark mode / light mode toggle
- Fully responsive UI

---

## Tech Stack

**Frontend**
- HTML, CSS, Vanilla JavaScript
- Hosted on Netlify

**Backend**
- Node.js, Express.js
- MongoDB Atlas + Mongoose
- Cloudinary (image & video uploads)
- JWT authentication + bcryptjs
- Hosted on Render

---

## Project Structure

```
petconnect/
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── login.js
│   │   ├── signup.js
│   │   ├── main.js
│   │   └── profile.js
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── dashboard.html
│   └── profile.html
│
└── backend/
    ├── config/
    │   ├── db.js
    │   └── cloudinary.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── uploadMiddleware.js
    ├── models/
    │   ├── User.js
    │   ├── Post.js
    │   └── SignupLimit.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── postRoutes.js
    │   └── profileRoutes.js
    └── server.js
```

---

## Getting Started Locally

### Prerequisites
- Node.js
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repo
```bash
git clone https://github.com/dhatchin676/petconnect.git
cd petconnect
```

### 2. Setup backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
```

Start the backend:
```bash
npm run dev
```

### 3. Setup frontend
Open `frontend/js/login.js`, `signup.js`, `main.js`, `profile.js` and set:
```js
const API = "http://localhost:5000/api";
```

Then open `frontend/index.html` in your browser or use Live Server.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/posts` | Get all posts |
| POST | `/api/posts` | Create a post |
| POST | `/api/posts/:id/like` | Like or unlike a post |
| POST | `/api/posts/:id/comment` | Add a comment |
| DELETE | `/api/posts/:id` | Delete a post |
| GET | `/api/profile/me` | Get current user profile |
| PUT | `/api/profile/me` | Update profile |

---

## Deployment

- **Backend** deployed on [Render](https://render.com)
- **Frontend** deployed on [Netlify](https://netlify.com)

---

## Author

**Dhatchin** — [@dhatchin676](https://github.com/dhatchin676)