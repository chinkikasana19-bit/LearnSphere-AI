# LearnSphere AI

A manageable, resume-ready MERN Learning Management System with AI integration.

## Main features

- Student and instructor registration/login
- Role-based protected routes
- Instructor course creation
- Text lessons and PDF notes
- Student course enrolment
- AI-generated summaries from course content
- AI-generated MCQ quizzes
- Quiz attempts and automatic scoring
- Course progress tracking
- Student and instructor dashboards

## Tech stack

- React + Vite
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT authentication
- Groq Chat Completions API
- Multer + pdf-parse
- Recharts

## Project structure

```text
LearnSphere-AI/
├── client/
└── server/
```

## 1. Configure MongoDB and Groq

Create `server/.env` by copying `server/.env.example`.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

The model is configurable because available Groq model IDs may change.

## 2. Run the backend

```bash
cd server
npm install
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

## 3. Run the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Demo workflow

1. Register an instructor account.
2. Create a course.
3. Add text lessons or upload a PDF.
4. Register a student account.
5. Enrol in the course.
6. Generate an AI summary.
7. Generate an AI quiz.
8. Attempt the quiz and view the result.
9. Mark lessons complete and view progress.

## Important production improvements

Before presenting it as a production system, consider adding:

- Email verification and password reset
- Cloudinary or S3 file storage
- Refresh tokens in secure HTTP-only cookies
- Request validation using Zod or Joi
- Automated tests
- API rate limiting per user
- Instructor quiz review before publishing
- Docker and CI/CD
