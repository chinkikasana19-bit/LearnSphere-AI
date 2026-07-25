import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: {
      type: [String],
      validate: value => value.length === 4
    },
    correctAnswer: { type: Number, min: 0, max: 3, required: true },
    explanation: { type: String, default: "" }
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    questions: [questionSchema],
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
