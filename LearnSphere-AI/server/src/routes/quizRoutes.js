import express from "express";
import {
  generateCourseQuiz,
  listCourseQuizzes,
  getQuiz,
  submitQuiz
} from "../controllers/quizController.js";
import { protect, allowRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/course/:courseId/generate",
  protect,
  allowRoles("instructor"),
  generateCourseQuiz
);
router.get("/course/:courseId", protect, listCourseQuizzes);
router.get("/:quizId", protect, getQuiz);
router.post(
  "/:quizId/submit",
  protect,
  allowRoles("student"),
  submitQuiz
);

export default router;
