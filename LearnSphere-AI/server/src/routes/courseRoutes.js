import express from "express";
import {
  listCourses,
  getCourse,
  createCourse,
  addTextLesson,
  addPdfLesson,
  enroll,
  markLessonComplete,
  getProgress,
  summarizeCourse
} from "../controllers/courseController.js";
import { protect, allowRoles } from "../middleware/authMiddleware.js";
import { uploadPdf } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", listCourses);
router.get("/:courseId", getCourse);

router.post("/", protect, allowRoles("instructor"), createCourse);
router.post(
  "/:courseId/lessons/text",
  protect,
  allowRoles("instructor"),
  addTextLesson
);
router.post(
  "/:courseId/lessons/pdf",
  protect,
  allowRoles("instructor"),
  uploadPdf.single("pdf"),
  addPdfLesson
);
router.post("/:courseId/enroll", protect, allowRoles("student"), enroll);
router.post(
  "/:courseId/lessons/:lessonId/complete",
  protect,
  allowRoles("student"),
  markLessonComplete
);
router.get(
  "/:courseId/progress",
  protect,
  allowRoles("student"),
  getProgress
);
router.post("/:courseId/ai-summary", protect, summarizeCourse);

export default router;
