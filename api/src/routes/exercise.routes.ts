import { Router } from "express";
import { ExerciseController } from "../controllers/exercise.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
const exerciseController = new ExerciseController();

// Apply authentication middleware to all routes in this file
router.use(authMiddleware);

router.get("/", exerciseController.getAvailableExercises);
router.post("/", exerciseController.createCustomExercise);
router.patch("/:id", exerciseController.updateCustomExercise);
router.delete("/:id", exerciseController.deleteCustomExercise);

export default router;
