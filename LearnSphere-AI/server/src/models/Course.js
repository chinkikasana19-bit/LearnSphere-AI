import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
    pdfFileName: { type: String, default: "" },
    pdfPath: { type: String, default: "" },
    extractedText: { type: String, default: "" },
    order: { type: Number, default: 1 }
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 1500 },
    category: { type: String, default: "General" },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    lessons: [lessonSchema],
    enrolledStudents: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
