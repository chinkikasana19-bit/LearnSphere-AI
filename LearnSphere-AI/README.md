# 🎓 LearnSphere AI – AI-Powered Learning Management System

<p align="center">

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Groq AI](https://img.shields.io/badge/AI-Groq-purple)
![License](https://img.shields.io/badge/License-MIT-blue)

</p>

---

# 🚀 Live Demo

### 🌐 Frontend

https://learn-sphere-ai-peach.vercel.app/

### ⚙️ Backend API

https://learnsphere-ai-backend.onrender.com/api/health

---

# 📖 Overview

**LearnSphere AI** is a full-stack AI-powered Learning Management System (LMS) developed using the MERN stack.

The platform enables instructors to create and manage courses, upload learning materials, and students to enroll in courses, track their learning progress, generate AI-powered summaries, and attempt AI-generated quizzes.

The project integrates **Groq LLM** to provide intelligent educational assistance from uploaded learning materials.

---

# ✨ Features

## 👨‍🏫 Instructor Features

- Secure JWT Authentication
- Create new courses
- Add text-based lessons
- Upload PDF course material
- Automatic PDF text extraction
- Publish structured learning content

---

## 👨‍🎓 Student Features

- User Registration & Login
- Browse available courses
- Enroll in courses
- Mark lessons as completed
- Track learning progress
- View enrolled courses

---

## 🤖 AI Features

- AI-powered Course Summarization
- Exam-oriented revision notes
- AI Quiz Generation
- Multiple-choice quizzes
- Difficulty-based quiz creation
- Uses Groq LLM API

---

## 📊 Dashboard

- Course Progress Tracking
- Completion Percentage
- Student Dashboard
- Instructor Dashboard
- Course Analytics

---

# 🏗️ Project Architecture

```
LearnSphere-AI
│
├── client
│   ├── React
│   ├── Vite
│   ├── Axios
│   └── Tailwind CSS
│
├── server
│   ├── Express
│   ├── MongoDB
│   ├── JWT Authentication
│   ├── Multer
│   ├── PDF Parser
│   └── Groq AI Integration
│
└── MongoDB Atlas
```

---

# 🛠 Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM

### Backend

- Node.js
- Express.js
- JWT Authentication
- Multer
- PDF Parse
- Morgan

### Database

- MongoDB Atlas
- Mongoose

### AI

- Groq API
- Llama 3.3 70B Versatile Model

### Deployment

- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas

---

# 📚 AI Workflow

```
Student uploads PDF
          │
          ▼
Text Extraction
          │
          ▼
Stored in MongoDB
          │
          ▼
Groq AI Analysis
          │
          ▼
AI Summary
AI Quiz
```

---

# 🔐 Authentication

- JWT Authentication
- Protected Routes
- Instructor Authorization
- Student Authorization
- Password Hashing

---

# 📂 Core Modules

- Authentication Module
- Course Management
- Lesson Management
- PDF Upload System
- AI Summary Engine
- AI Quiz Generator
- Student Progress Tracker
- Dashboard

---

# 📷 Screenshots

You can add screenshots here.

Example:

```
screenshots/
    home.png
    dashboard.png
    course.png
    ai-summary.png
    quiz.png
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/chinkikasana19-bit/LearnSphere-AI.git
```

---

## Backend Setup

```bash
cd LearnSphere-AI/server
npm install
```

Create a `.env` file

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret

GROQ_API_KEY=your_groq_api_key

GROQ_MODEL=llama-3.3-70b-versatile

CLIENT_URL=http://localhost:5173
```

Run backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd LearnSphere-AI/client
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend

```bash
npm run dev
```

---

# 🚀 Deployment

## Frontend

- Vercel

## Backend

- Render

## Database

- MongoDB Atlas

---

# 📌 Future Improvements

- AI Chat with Uploaded Notes
- AI Doubt Solver
- Certificate Generation
- Assignment Submission
- Video Lecture Support
- Discussion Forum
- Email Notifications
- Course Ratings & Reviews
- Instructor Analytics
- AI Learning Recommendations

---

# 🎯 Learning Outcomes

This project demonstrates:

- MERN Stack Development
- REST API Design
- JWT Authentication
- MongoDB Schema Design
- AI Integration with Groq
- PDF Processing
- File Upload Management
- Deployment on Render & Vercel
- Environment Variable Management
- Production-ready Project Structure

---

# 👨‍💻 Author

**Chinky Kasana**

B.Tech CSE Student

---

# ⭐ If you like this project

Give this repository a ⭐ on GitHub.
