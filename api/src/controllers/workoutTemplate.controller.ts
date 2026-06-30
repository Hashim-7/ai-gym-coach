import type { Request, Response } from "express";
import { WorkoutService } from "../services/workout.service.js";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export class WorkoutTemplateController {
  private workoutService = new WorkoutService();

  // POST /api/workout-templates
  createTemplate = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const creatorId = req.user?.id;
      const { name, exercises } = req.body;

      if (!creatorId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const template = await this.workoutService.createTemplate(
        creatorId,
        name as string,
        exercises,
      );
      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // GET /api/workout-templates
  getUserTemplates = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const creatorId = req.user?.id;

      if (!creatorId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const templates = await this.workoutService.getUserTemplates(creatorId);
      res.status(200).json(templates);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // GET /api/workout-templates/:id
  getTemplateDetails = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const templateId = req.params.id as string;
      const creatorId = req.user?.id;

      if (!creatorId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const template = await this.workoutService.getTemplateDetails(
        templateId,
        creatorId,
      );
      res.status(200).json(template);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // PATCH /api/workout-templates/:id
  updateTemplateName = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const creatorId = req.user?.id;
      const { name } = req.body;

      if (!creatorId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const updatedTemplate = await this.workoutService.updateTemplateName(
        id,
        creatorId,
        name as string,
      );
      res.status(200).json(updatedTemplate);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // POST /api/workout-templates/:id/exercises
  addExerciseToTemplate = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const templateId = req.params.id as string;
      const data = req.body;
      const workoutExercise = await this.workoutService.addExerciseToTemplate(
        templateId,
        data,
      );
      res.status(201).json(workoutExercise);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // PATCH /api/workout-templates/exercises/:workoutExerciseId
  updateTemplateExerciseTargets = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const id = req.params.workoutExerciseId as string;
      const data = req.body;
      const updatedExercise =
        await this.workoutService.updateTemplateExerciseTargets(id, data);
      res.status(200).json(updatedExercise);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // DELETE /api/workout-templates/exercises/:workoutExerciseId
  removeExerciseFromTemplate = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const workoutExerciseId = req.params.workoutExerciseId as string;
      const removedExercise =
        await this.workoutService.removeExerciseFromTemplate(workoutExerciseId);
      res.status(200).json(removedExercise);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // DELETE /api/workout-templates/:id
  deleteTemplate = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const creatorId = req.user?.id;

      if (!creatorId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const deletedTemplate = await this.workoutService.deleteTemplate(
        id,
        creatorId,
      );
      res.status(200).json(deletedTemplate);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };
}
