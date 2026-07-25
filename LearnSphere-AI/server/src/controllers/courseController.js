import fs from "fs/promises";
import pdf from "pdf-parse";
import Course from "../models/Course.js";
import User from "../models/User.js";
import Progress from "../models/Progress.js";
import { generateSummary } from "../services/aiService.js";

function hasId(list, id) {
  return list.some(item => item.toString() === id.toString());
}

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

export async function listCourses(req, res, next) {
  try {
    const courses = await Course.find({ published: true })
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, courses });
  } catch (error) {
    next(error);
  }
}

export async function getCourse(req, res, next) {
  try {
    const course = await Course.findById(req.params.courseId).populate(
      "instructor",
      "name email"
    );

    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    res.json({ success: true, course });
  } catch (error) {
    next(error);
  }
}

export async function createCourse(req, res, next) {
  try {
    const { title, description, category, level } = req.body;

    if (!title || !description) {
      res.status(400);
      throw new Error("Title and description are required");
    }

    const course = await Course.create({
      title,
      description,
      category,
      level,
      instructor: req.user._id
    });

    res.status(201).json({ success: true, course });
  } catch (error) {
    next(error);
  }
}

export async function addTextLesson(req, res, next) {
  try {
    const { title, content } = req.body;
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Only the course instructor can add lessons");
    }

    if (!title || !content) {
      res.status(400);
      throw new Error("Lesson title and content are required");
    }

    course.lessons.push({
      title,
      content,
      order: course.lessons.length + 1
    });
    await course.save();

    res.status(201).json({ success: true, course });
  } catch (error) {
    next(error);
  }
}

export async function addPdfLesson(req, res, next) {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Only the course instructor can add lessons");
    }

    if (!req.file) {
      res.status(400);
      throw new Error("Please upload a PDF file");
    }

    const fileBuffer = await fs.readFile(req.file.path);
    const parsed = await pdf(fileBuffer);

    course.lessons.push({
      title: req.body.title || req.file.originalname,
      pdfFileName: req.file.originalname,
      pdfPath: `/uploads/${req.file.filename}`,
      extractedText: parsed.text.slice(0, 100000),
      order: course.lessons.length + 1
    });

    await course.save();
    res.status(201).json({ success: true, course });
  } catch (error) {
    next(error);
  }
}

export async function enroll(req, res, next) {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    if (!hasId(course.enrolledStudents, req.user._id)) {
      course.enrolledStudents.push(req.user._id);
      await course.save();
    }

    if (!hasId(req.user.enrolledCourses, course._id)) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { enrolledCourses: course._id }
      });
    }

    await Progress.findOneAndUpdate(
      { student: req.user._id, course: course._id },
      { $setOnInsert: { completedLessons: [] } },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: "Course enrolled successfully" });
  } catch (error) {
    next(error);
  }
}

export async function markLessonComplete(req, res, next) {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    if (!hasId(course.enrolledStudents, req.user._id)) {
      res.status(403);
      throw new Error("Please enrol in this course first");
    }

    const lessonExists = course.lessons.id(req.params.lessonId);
    if (!lessonExists) {
      res.status(404);
      throw new Error("Lesson not found");
    }

    const progress = await Progress.findOneAndUpdate(
      { student: req.user._id, course: course._id },
      { $addToSet: { completedLessons: lessonExists._id } },
      { new: true, upsert: true }
    );

    const percentage = course.lessons.length
      ? Math.round((progress.completedLessons.length / course.lessons.length) * 100)
      : 0;

    res.json({ success: true, progress, percentage });
  } catch (error) {
    next(error);
  }
}

export async function getProgress(req, res, next) {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    const progress = await Progress.findOne({
      student: req.user._id,
      course: course._id
    });

    const completed = progress?.completedLessons.length || 0;
    const percentage = course.lessons.length
      ? Math.round((completed / course.lessons.length) * 100)
      : 0;

    res.json({
      success: true,
      completedLessons: progress?.completedLessons || [],
      totalLessons: course.lessons.length,
      percentage
    });
  } catch (error) {
    next(error);
  }
}

export async function summarizeCourse(req, res, next) {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    const isInstructor =
      course.instructor.toString() === req.user._id.toString();
    const isEnrolled = hasId(course.enrolledStudents, req.user._id);

    if (!isInstructor && !isEnrolled) {
      res.status(403);
      throw new Error("Enrol in the course to use its AI assistant");
    }

    const material = courseMaterial(course);
    if (!material) {
      res.status(400);
      throw new Error("Add at least one lesson before generating a summary");
    }

    const summary = await generateSummary(
      course.title,
      material,
      req.body.style || "exam-oriented"
    );

    res.json({ success: true, summary });
  } catch (error) {
    next(error);
  }
}
