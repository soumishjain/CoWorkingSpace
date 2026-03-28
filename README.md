# 🚀 CoWorking Space Platform

A full-stack MERN application designed to simulate a real-world company workspace environment where users can create, manage, and collaborate within structured workspaces.

The platform goes beyond basic collaboration by introducing organized workflows such as departments, member roles, join-request systems, and a dynamic leaderboard—allowing teams to manage access, track participation, and encourage healthy competition within the workspace.

Users can explore and join workspaces, get assigned to specific departments, and collaborate in a controlled environment that mimics how modern organizations operate. The integrated leaderboard system highlights active contributors, helping teams recognize performance and boost engagement.

With real-time features and scalable architecture, the application reflects systems similar to Slack or Discord, but with a stronger focus on **workspace management, task coordination, performance tracking, and organizational hierarchy**.

The core motivation of this project is to demonstrate how a digital platform can streamline team collaboration, manage distributed teams, bring structure to project execution, and motivate users through measurable contributions in a company-like ecosystem.


---

## 🌐 Live Demo

* Frontend: https://co-working-space-drab.vercel.app
* Backend: https://coworkingspace.onrender.com

---

## ✨ Features

### 👤 Authentication

* User registration & login (JWT-based)
* Email verification system  (Not in Production)
* Secure cookie-based auth

### 🏢 Workspace Management

* Create / delete workspace
* Join workspace via request system
* Workspace cover image upload
* Member management

### 🤝 Join Request System

* Send join requests
* Admin can approve/reject requests
* Real-time request status (Pending / Approved / Rejected)

### 🔍 Explore & Search

* Explore trending workspaces
* Search workspaces with debounce
* Instant UI updates on join request

### 💬 Real-time Communication

* Socket.io integration
* Live chat system
* Real-time updates

### 📊 Dashboard & Stats

* Workspace statistics
* Member count
* Activity insights

---

## 🛠️ Tech Stack

### Frontend

* React.js (Vite)
* Tailwind CSS
* Axios
* Socket.io-client

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* Socket.io

### Services

* Render (Backend hosting)
* Vercel (Frontend hosting)
* Resend (Email service)
* ImageKit (Image upload)

---

## 📁 Project Structure

```bash
coworking-space/
│
├── Backend/
│   ├── src/
│   │   ├── features/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── sockets/
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── state/
│   │   └── api/
```

---

## ⚙️ Environment Variables

### Backend (.env)

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

RESEND_API_KEY=your_resend_key

IMAGE_KIT_PRIVATE_KEY=your_key

PORT=3000
VITE_URL=http://localhost:5173
```

---

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
VITE_BACKEND_URL=http://localhost:3000
```

---

## 🚀 Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/coworking-space.git
cd coworking-space
```

---

### 2️⃣ Backend Setup

```bash
cd Backend
npm install
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

---

## 🔥 Key Concepts Implemented

* REST API Design
* JWT Authentication
* Cookie-based sessions
* Real-time communication (Socket.io)
* Debounced search
* Optimistic UI updates
* Role-based access control

---

## 🧠 Learning Highlights

This project demonstrates:

* Full-stack system design
* Handling async state properly
* Backend-driven UI consistency
* Production deployment challenges (CORS, cookies, env)
* Real-world debugging (email, sockets, auth)

---

## ⚠️ Challenges Faced

* CORS & cookie issues in production
* Email service integration (SMTP → Resend)
* State synchronization between search & explore
* Real-time socket handling
* Deployment errors (Vercel + Render)

---

## 🚀 Future Improvements

* Workspace chat UI enhancements
* Full Company Management System From leave request to salary updates
* File sharing
* Better search ranking

---

## 🤝 Contributing

Feel free to fork the repo and contribute!

---

## 📜 License

This project is open-source and available under the MIT License.

---

## 💀 Final Note

This is not just a CRUD app —
it handles **real-world problems like auth, state sync, real-time updates, and deployment issues**.

---

Made with ❤️ by Somesh
