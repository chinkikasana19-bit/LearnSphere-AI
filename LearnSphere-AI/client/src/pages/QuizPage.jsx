import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function QuizPage() {
  const { quizId } = useParams();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/quizzes/${quizId}`)
      .then(({ data }) => {
        setQuiz(data.quiz);
        setAnswers(Array(data.quiz.questions.length).fill(null));
      })
      .catch(err =>
        setError(err.response?.data?.message || "Could not load quiz")
      );
  }, [quizId]);

  async function submit(event) {
    event.preventDefault();

    try {
      const { data } = await api.post(`/quizzes/${quizId}/submit`, { answers });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit quiz");
    }
  }

  if (error && !quiz) return <div className="error">{error}</div>;
  if (!quiz) return <div className="empty">Loading quiz...</div>;

  if (user.role !== "student") {
    return (
      <section className="panel">
        <h1>{quiz.title}</h1>
        <p>
          This quiz contains {quiz.questions.length} questions. Log in as a
          student to attempt it.
        </p>
      </section>
    );
  }

  return (
    <section className="quiz-page">
      <span className="eyebrow">{quiz.difficulty} difficulty</span>
      <h1>{quiz.title}</h1>

      {error && <div className="error">{error}</div>}

      {!result ? (
        <form onSubmit={submit}>
          {quiz.questions.map((item, questionIndex) => (
            <article className="question-card" key={item._id}>
              <h3>
                {questionIndex + 1}. {item.question}
              </h3>

              <div className="options">
                {item.options.map((option, optionIndex) => (
                  <label className="option" key={optionIndex}>
                    <input
                      type="radio"
                      name={`question-${questionIndex}`}
                      checked={answers[questionIndex] === optionIndex}
                      onChange={() =>
                        setAnswers(current => {
                          const copy = [...current];
                          copy[questionIndex] = optionIndex;
                          return copy;
                        })
                      }
                    />
                    {option}
                  </label>
                ))}
              </div>
            </article>
          ))}

          <button
            className="button"
            disabled={answers.some(answer => answer === null)}
          >
            Submit quiz
          </button>
        </form>
      ) : (
        <div className="panel result-panel">
          <span className="eyebrow">Quiz result</span>
          <h2>
            {result.attempt.score}/{result.attempt.total} correct
          </h2>
          <div className="result-score">{result.attempt.percentage}%</div>

          {result.review.map((item, index) => (
            <div className="review-item" key={index}>
              <strong>{item.question}</strong>
              <p>
                {item.selectedAnswer === item.correctAnswer
                  ? "Correct"
                  : `Incorrect. Correct option: ${item.correctAnswer + 1}`}
              </p>
              <small>{item.explanation}</small>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
