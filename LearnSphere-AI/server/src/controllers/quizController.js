import Course from "../models/Course.js";
import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";
import { generateQuiz } from "../services/aiService.js";

function courseMaterial(course) {
  return course.lessons
    .map(
      lesson =>
        `Lesson: ${lesson.title}\n${lesson.content || ""}\n${
          lesson.extractedText || ""
        }`
    )
    .join("\n\n")
    .trim();
}

export async function generateCourseQuiz(req, res, next) {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Only the instructor can generate a quiz");
    }

    const material = courseMaterial(course);
    if (!material) {
      res.status(400);
      throw new Error("Add course content before generating a quiz");
    }

    const difficulty = ["easy", "medium", "hard"].includes(req.body.difficulty)
      ? req.body.difficulty
      : "medium";

    const generated = await generateQuiz(
      course.title,
      material,
      difficulty,
      req.body.count || 5
    );

    if (!Array.isArray(generated.questions) || generated.questions.length === 0) {
      throw new Error("The AI did not return valid quiz questions");
    }

    const quiz = await Quiz.create({
      title: generated.title || `${course.title} Quiz`,
      course: course._id,
      createdBy: req.user._id,
      difficulty,
      questions: generated.questions
    });

    res.status(201).json({ success: true, quiz });
  } catch (error) {
    next(error);
  }
}

export async function listCourseQuizzes(req, res, next) {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId })
      .select("-questions.correctAnswer")
      .sort({ createdAt: -1 });

    res.json({ success: true, quizzes });
  } catch (error) {
    next(error);
  }
}

export async function getQuiz(req, res, next) {
  try {
    const quiz = await Quiz.findById(req.params.quizId).lean();

    if (!quiz) {
      res.status(404);
      throw new Error("Quiz not found");
    }

    quiz.questions = quiz.questions.map(question => ({
      _id: question._id,
      question: question.question,
      options: question.options
    }));

    res.json({ success: true, quiz });
  } catch (error) {
    next(error);
  }
}

export async function submitQuiz(req, res, next) {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      res.status(404);
      throw new Error("Quiz not found");
    }

    const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
    let score = 0;

    quiz.questions.forEach((question, index) => {
      if (Number(answers[index]) === question.correctAnswer) score += 1;
    });

    const total = quiz.questions.length;
    const percentage = total ? Math.round((score / total) * 100) : 0;

    const attempt = await QuizAttempt.create({
      student: req.user._id,
      quiz: quiz._id,
      answers,
      score,
      total,
      percentage
    });

    const review = quiz.questions.map((question, index) => ({
      question: question.question,
      selectedAnswer: answers[index],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation
    }));

    res.status(201).json({
      success: true,
      attempt,
      review
    });
  } catch (error) {
    next(error);
  }
}
