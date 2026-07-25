import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";

export async function getStudentDashboard(req, res, next) {
  try {
    const courses = await Course.find({
      enrolledStudents: req.user._id
    }).select("title lessons");

    const progressRows = await Progress.find({
      student: req.user._id,
      course: { $in: courses.map(course => course._id) }
    });

    const attempts = await QuizAttempt.find({ student: req.user._id })
      .populate("quiz", "title course")
      .sort({ createdAt: -1 })
      .limit(10);

    const progressMap = new Map(
      progressRows.map(row => [row.course.toString(), row.completedLessons.length])
    );

    const courseProgress = courses.map(course => {
      const completed = progressMap.get(course._id.toString()) || 0;
      return {
        courseId: course._id,
        title: course.title,
        percentage: course.lessons.length
          ? Math.round((completed / course.lessons.length) * 100)
          : 0
      };
    });

    const averageScore = attempts.length
      ? Math.round(
          attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) /
            attempts.length
        )
      : 0;

    res.json({
      success: true,
      stats: {
        enrolledCourses: courses.length,
        completedCourses: courseProgress.filter(item => item.percentage === 100)
          .length,
        quizAttempts: attempts.length,
        averageScore
      },
      courseProgress,
      recentAttempts: attempts
    });
  } catch (error) {
    next(error);
  }
}

export async function getInstructorDashboard(req, res, next) {
  try {
    const courses = await Course.find({ instructor: req.user._id });
    const quizzes = await Quiz.find({ createdBy: req.user._id });

    const totalStudents = courses.reduce(
      (sum, course) => sum + course.enrolledStudents.length,
      0
    );

    res.json({
      success: true,
      stats: {
        courses: courses.length,
        lessons: courses.reduce(
          (sum, course) => sum + course.lessons.length,
          0
        ),
        totalStudents,
        quizzes: quizzes.length
      },
      courses
    });
  } catch (error) {
    next(error);
  }
}
