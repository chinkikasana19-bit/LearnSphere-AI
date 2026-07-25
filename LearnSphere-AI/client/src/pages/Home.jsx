import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Sparkles, BarChart3 } from "lucide-react";
import api from "../api.js";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/courses")
      .then(({ data }) => setCourses(data.courses))
      .catch(err =>
        setError(err.response?.data?.message || "Could not load courses")
      );
  }, []);

  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">MERN + AI Learning Platform</span>
          <h1>Learn smarter with AI-powered course tools.</h1>
          <p>
            Enrol in structured courses, generate revision summaries, attempt
            AI-created quizzes and monitor your learning progress.
          </p>
          <Link className="button" to="/register">
            Get started
          </Link>
        </div>

        <div className="hero-panel">
          <div><BookOpen /> Structured courses</div>
          <div><Sparkles /> AI summaries and quizzes</div>
          <div><BarChart3 /> Learning analytics</div>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <span className="eyebrow">Course catalogue</span>
            <h2>Explore available courses</h2>
          </div>
        </div>

        {error && <div className="error">{error}</div>}
        <div className="card-grid">
          {courses.map(course => (
            <article className="course-card" key={course._id}>
              <span className="pill">{course.category}</span>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="meta">
                <span>{course.level}</span>
                <span>{course.lessons.length} lessons</span>
              </div>
              <p className="muted">
                Instructor: {course.instructor?.name || "Unknown"}
              </p>
              <Link className="button secondary" to={`/courses/${course._id}`}>
                View course
              </Link>
            </article>
          ))}
        </div>

        {!courses.length && !error && (
          <div className="empty">No courses have been created yet.</div>
        )}
      </section>
    </>
  );
}
