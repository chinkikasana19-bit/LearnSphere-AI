import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

export default function CreateCourse() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Computer Science",
    level: "Beginner"
  });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/courses", form);
      navigate(`/courses/${data.course._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create course");
    }
  }

  return (
    <section className="panel narrow">
      <h1>Create a course</h1>
      <p>Add lessons after creating the course.</p>
      {error && <div className="error">{error}</div>}

      <form className="form-grid" onSubmit={submit}>
        <label>
          Course title
          <input
            required
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
        </label>
        <label>
          Description
          <textarea
            rows="5"
            required
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <label>
          Category
          <input
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          />
        </label>
        <label>
          Level
          <select
            value={form.level}
            onChange={e => setForm({ ...form, level: e.target.value })}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </label>
        <button className="button">Create course</button>
      </form>
    </section>
  );
}
