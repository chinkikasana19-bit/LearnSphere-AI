import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true
    },
    answers: [{ type: Number }],
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    percentage: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("QuizAttempt", quizAttemptSchema);
