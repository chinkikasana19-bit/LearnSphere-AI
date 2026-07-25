import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function CourseDetails() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [progress, setProgress] = useState(null);
  const [summary, setSummary] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [lessonForm, setLessonForm] = useState({ title: "", content: "" });
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const isInstructor =
    user?.role === "instructor" &&
    user?.id === (course?.instructor?._id || course?.instructor);

  async function loadCourse() {
    const { data } = await api.get(`/courses/${courseId}`);
    setCourse(data.course);
  }

  async function loadQuizzes() {
    if (!user) return;
    const { data } = await api.get(`/quizzes/course/${courseId}`);
    setQuizzes(data.quizzes);
  }

  async function loadProgress() {
    if (user?.role !== "student") return;
    try {
      const { data } = await api.get(`/courses/${courseId}/progress`);
      setProgress(data);
    } catch {
      setProgress(null);
    }
  }

  useEffect(() => {
    loadCourse().catch(err =>
      setError(err.response?.data?.message || "Could not load course")
    );
  }, [courseId]);

  useEffect(() => {
    if (user) {
      loadQuizzes().catch(() => {});
      loadProgress();
    }
  }, [user, courseId]);

  async function enroll() {
    try {
      await api.post(`/courses/${courseId}/enroll`);
      setMessage("Course enrolled successfully.");
      await loadCourse();
      await loadProgress();
    } catch (err) {
      setError(err.response?.data?.message || "Could not enrol");
    }
  }

  async function addLesson(event) {
    event.preventDefault();
    try {
      await api.post(`/courses/${courseId}/lessons/text`, lessonForm);
      setLessonForm({ title: "", content: "" });
      await loadCourse();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add lesson");
    }
  }

  async function uploadPdf(event) {
    event.preventDefault();
    if (!pdfFile) return;

    const formData = new FormData();
    formData.append("title", pdfTitle);
    formData.append("pdf", pdfFile);

    try {
      await api.post(`/courses/${courseId}/lessons/pdf`, formData);
      setPdfFile(null);
      setPdfTitle("");
      event.target.reset();
      await loadCourse();
    } catch (err) {
      setError(err.response?.data?.message || "Could not upload PDF");
    }
  }

  async function completeLesson(lessonId) {
    try {
      const { data } = await api.post(
        `/courses/${courseId}/lessons/${lessonId}/complete`
      );
      setProgress(current => ({
        ...(current || {}),
        completedLessons: data.progress.completedLessons,
        percentage: data.percentage,
        totalLessons: course.lessons.length
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Could not update progress");
    }
  }

  async function generateSummary() {
    setAiLoading(true);
    setError("");
    try {
      const { data } = await api.post(`/courses/${courseId}/ai-summary`, {
        style: "exam-oriented"
      });
      setSummary(data.summary);
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate summary");
    } finally {
      setAiLoading(false);
    }
  }

  async function generateQuiz() {
    setAiLoading(true);
    setError("");
    try {
      await api.post(`/quizzes/course/${courseId}/generate`, {
        difficulty: "medium",
        count: 5
      });
      setMessage("AI quiz generated successfully.");
      await loadQuizzes();
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate quiz");
    } finally {
      setAiLoading(false);
    }
  }

  if (error && !course) return <div className="error">{error}</div>;
  if (!course) return <div className="empty">Loading course...</div>;

  const enrolled = user
    ? course.enrolledStudents.some(
        id => (id._id || id).toString() === user.id
      )
    : false;

  const completedIds = (progress?.completedLessons || []).map(String);

  return (
    <section>
      <div className="course-banner">
        <span className="pill">{course.category}</span>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <div className="meta">
          <span>{course.level}</span>
          <span>{course.lessons.length} lessons</span>
          <span>{course.enrolledStudents.length} students</span>
        </div>

        {user?.role === "student" && !enrolled && (
          <button className="button" onClick={enroll}>
            Enrol now
          </button>
        )}

        {user?.role === "student" && progress && (
          <div className="progress-wrap">
            <div className="progress-label">
              <span>Course progress</span>
              <strong>{progress.percentage}%</strong>
            </div>
            <div className="progress-track">
              <div
                className="progress-bar"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      <div className="two-column">
        <div>
          <div className="section-heading">
            <h2>Course lessons</h2>
          </div>

          <div className="lesson-list">
            {course.lessons.map((lesson, index) => (
              <article className="lesson-card" key={lesson._id}>
                <div>
                  <span className="lesson-number">{index + 1}</span>
                  <h3>{lesson.title}</h3>
                </div>
                {lesson.content && <p>{lesson.content}</p>}
                {lesson.pdfPath && (
                  <a
                  href={`${import.meta.env.VITE_API_URL.replace("/api","")}${lesson.pdfPath}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open uploaded PDF
                  </a>
                )}

                {user?.role === "student" && enrolled && (
                  <button
                    className="button secondary"
                    disabled={completedIds.includes(lesson._id)}
                    onClick={() => completeLesson(lesson._id)}
                  >
                    {completedIds.includes(lesson._id)
                      ? "Completed"
                      : "Mark complete"}
                  </button>
                )}
              </article>
            ))}
            {!course.lessons.length && (
              <div className="empty">No lessons have been added.</div>
            )}
          </div>
        </div>

        <aside>
          <div className="panel">
            <h2>AI study tools</h2>
            <p>Generate an exam-oriented summary from the course material.</p>
            <button
              className="button"
              onClick={generateSummary}
              disabled={!user || aiLoading}
            >
              {aiLoading ? "Working..." : "Generate AI summary"}
            </button>

            {isInstructor && (
              <button
                className="button secondary block"
                onClick={generateQuiz}
                disabled={aiLoading || !course.lessons.length}
              >
                Generate 5-question AI quiz
              </button>
            )}

            {!user && <p className="muted">Log in to use AI features.</p>}
          </div>

          <div className="panel">
            <h2>Quizzes</h2>
            {quizzes.map(quiz => (
              <Link
                className="quiz-link"
                key={quiz._id}
                to={`/quizzes/${quiz._id}`}
              >
                <strong>{quiz.title}</strong>
                <span>{quiz.questions.length} questions</span>
              </Link>
            ))}
            {!quizzes.length && <p className="muted">No quiz available yet.</p>}
          </div>
        </aside>
      </div>

      {summary && (
        <section className="panel summary">
          <h2>AI-generated summary</h2>
          <pre>{summary}</pre>
        </section>
      )}

      {isInstructor && (
        <section className="instructor-tools">
          <div className="panel">
            <h2>Add text lesson</h2>
            <form className="form-grid" onSubmit={addLesson}>
              <label>
                Lesson title
                <input
                  required
                  value={lessonForm.title}
                  onChange={e =>
                    setLessonForm({ ...lessonForm, title: e.target.value })
                  }
                />
              </label>
              <label>
                Lesson content
                <textarea
                  rows="7"
                  required
                  value={lessonForm.content}
                  onChange={e =>
                    setLessonForm({ ...lessonForm, content: e.target.value })
                  }
                />
              </label>
              <button className="button">Add lesson</button>
            </form>
          </div>

          <div className="panel">
            <h2>Upload PDF lesson</h2>
            <form className="form-grid" onSubmit={uploadPdf}>
              <label>
                Lesson title
                <input
                  required
                  value={pdfTitle}
                  onChange={e => setPdfTitle(e.target.value)}
                />
              </label>
              <label>
                PDF file
                <input
                  type="file"
                  accept="application/pdf"
                  required
                  onChange={e => setPdfFile(e.target.files?.[0] || null)}
                />
              </label>
              <button className="button">Upload PDF</button>
            </form>
          </div>
        </section>
      )}
    </section>
  );
}
