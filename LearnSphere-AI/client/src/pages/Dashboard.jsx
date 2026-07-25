import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

function Stat({ label, value }) {
  return (
    <div className="stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/dashboard/${user.role}`)
      .then(response => setData(response.data))
      .catch(err =>
        setError(err.response?.data?.message || "Could not load dashboard")
      );
  }, [user.role]);

  if (error) return <div className="error">{error}</div>;
  if (!data) return <div className="empty">Loading dashboard...</div>;

  if (user.role === "instructor") {
    return (
      <section>
        <div className="section-heading">
          <div>
            <span className="eyebrow">Instructor workspace</span>
            <h1>Welcome, {user.name}</h1>
          </div>
          <Link className="button" to="/courses/new">
            Create course
          </Link>
        </div>

        <div className="stats-grid">
          <Stat label="Courses" value={data.stats.courses} />
          <Stat label="Lessons" value={data.stats.lessons} />
          <Stat label="Student enrolments" value={data.stats.totalStudents} />
          <Stat label="AI quizzes" value={data.stats.quizzes} />
        </div>

        <div className="card-grid">
          {data.courses.map(course => (
            <article className="course-card" key={course._id}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="meta">
                <span>{course.lessons.length} lessons</span>
                <span>{course.enrolledStudents.length} students</span>
              </div>
              <Link className="button secondary" to={`/courses/${course._id}`}>
                Manage course
              </Link>
            </article>
          ))}
        </div>
      </section>
    );
  }

  const chartData = data.courseProgress.map(item => ({
    name:
      item.title.length > 12 ? `${item.title.slice(0, 12)}…` : item.title,
    progress: item.percentage
  }));

  return (
    <section>
      <span className="eyebrow">Student dashboard</span>
      <h1>Welcome, {user.name}</h1>

      <div className="stats-grid">
        <Stat label="Enrolled courses" value={data.stats.enrolledCourses} />
        <Stat label="Completed courses" value={data.stats.completedCourses} />
        <Stat label="Quiz attempts" value={data.stats.quizAttempts} />
        <Stat label="Average score" value={`${data.stats.averageScore}%`} />
      </div>

      <div className="panel">
        <h2>Course progress</h2>
        {chartData.length ? (
          <div className="chart">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="progress" fill="currentColor" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="empty">Enrol in a course to view progress.</div>
        )}
      </div>
    </section>
  );
}
