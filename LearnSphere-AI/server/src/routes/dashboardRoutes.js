import express from "express";
import {
  getStudentDashboard,
  getInstructorDashboard
} from "../controllers/dashboardController.js";
import { protect, allowRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/student",
  protect,
  allowRoles("student"),
  getStudentDashboard
);
router.get(
  "/instructor",
  protect,
  allowRoles("instructor"),
  getInstructorDashboard
);

export default router;
