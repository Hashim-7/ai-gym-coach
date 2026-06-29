import { Router } from "express";
import { WorkoutSessionController } from "../controllers/workoutSession.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
const sessionController = new WorkoutSessionController();

// Apply authentication middleware to all session and set tracking routes
router.use(authMiddleware);

// Session management
router.post("/", sessionController.startWorkoutSession);
router.get("/", sessionController.getWorkoutHistory);
router.get("/:id", sessionController.getWorkoutSessionDetails);
router.delete("/:id", sessionController.deleteWorkoutSession);

// Set logging management
router.post("/:id/sets", sessionController.logSet);
router.patch("/sets/:setId", sessionController.updateLoggedSet);
router.delete("/sets/:setId", sessionController.removeLoggedSet);

export default router;
