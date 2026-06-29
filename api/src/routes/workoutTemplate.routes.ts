import { Router } from "express";
import { WorkoutTemplateController } from "../controllers/workoutTemplate.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
const templateController = new WorkoutTemplateController();

// Apply authentication middleware
router.use(authMiddleware);

// Base template endpoints
router.post("/", templateController.createTemplate);
router.get("/", templateController.getUserTemplates);
router.get("/:id", templateController.getTemplateDetails);
router.patch("/:id", templateController.updateTemplateName);
router.delete("/:id", templateController.deleteTemplate);

// Template exercise sub-resources
router.post("/:id/exercises", templateController.addExerciseToTemplate);
router.patch(
  "/exercises/:workoutExerciseId",
  templateController.updateTemplateExerciseTargets,
);
router.delete(
  "/exercises/:workoutExerciseId",
  templateController.removeExerciseFromTemplate,
);

export default router;
