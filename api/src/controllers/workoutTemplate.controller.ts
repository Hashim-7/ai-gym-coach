import type { Request, Response } from "express";
import { WorkoutService } from "../services/workout.service.js";

export class WorkoutTemplateController {
  private workoutService = new WorkoutService();

  // POST /api/workout-templates
  createTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
      const { creatorId, name, exercises } = req.body;
      const template = await this.workoutService.createTemplate(
        creatorId as string,
        name as string,
        exercises,
      );
      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // GET /api/workout-templates
  getUserTemplates = async (req: Request, res: Response): Promise<void> => {
    try {
      const creatorId = (req.query.creatorId as string) || "";
      const templates = await this.workoutService.getUserTemplates(creatorId);
      res.status(200).json(templates);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // GET /api/workout-templates/:id
  getTemplateDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const templateId = req.params.id as string;
      const creatorId = (req.query.creatorId as string) || "";
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
  updateTemplateName = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const { creatorId, name } = req.body;
      const updatedTemplate = await this.workoutService.updateTemplateName(
        id,
        creatorId as string,
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
  deleteTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const creatorId =
        (req.body.creatorId as string) || (req.query.creatorId as string) || "";
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
