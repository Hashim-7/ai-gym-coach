import type { Request, Response } from "express";
import { WorkoutService } from "../services/workout.service.js";

// 1. Define the AuthenticatedRequest interface to include req.user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export class ExerciseController {
  private workoutService = new WorkoutService();

  /**
   * GET /api/exercises
   * Fetch all exercises available to the user.
   */
  public getAvailableExercises = async (
    req: AuthenticatedRequest, // Fixed: Changed from Request to AuthenticatedRequest
    res: Response,
  ): Promise<void> => {
    try {
      const creatorId = req.user?.id;

      if (!creatorId) {
        res.status(401).json({ error: "Unauthorized. User ID missing." });
        return;
      }

      // TypeScript now safely knows creatorId is strictly a string here
      const exercises =
        await this.workoutService.getAvailableExercises(creatorId);
      res.status(200).json(exercises);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  /**
   * POST /api/exercises
   * Create a new custom exercise definition.
   */
  public createCustomExercise = async (
    req: AuthenticatedRequest, // Fixed: Changed from Request to AuthenticatedRequest
    res: Response,
  ): Promise<void> => {
    try {
      const creatorId = req.user?.id;
      const { name, notes, muscleGroup } = req.body;

      if (!creatorId) {
        res.status(401).json({ error: "Unauthorized. User ID missing." });
        return;
      }

      const newExercise = await this.workoutService.createCustomExercise(
        creatorId,
        name as string,
        notes as string,
        muscleGroup as string,
      );

      res.status(201).json(newExercise);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  /**
   * PATCH /api/exercises/:id
   * Update fields on an existing custom exercise definition.
   */
  public updateCustomExercise = async (
    req: AuthenticatedRequest, // Fixed: Changed from Request to AuthenticatedRequest
    res: Response,
  ): Promise<void> => {
    try {
      const creatorId = req.user?.id;
      const id = parseInt(req.params.id as string, 10); // Added type assertion safely
      const { name, muscleGroup, notes } = req.body;

      if (!creatorId) {
        res.status(401).json({ error: "Unauthorized. User ID missing." });
        return;
      }

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid Exercise ID provided." });
        return;
      }

      const updatedExercise = await this.workoutService.updateCustomExercise(
        id,
        creatorId,
        {
          name: name as string,
          muscleGroup: muscleGroup as string,
          notes: notes as string,
        },
      );

      res.status(200).json(updatedExercise);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  /**
   * DELETE /api/exercises/:id
   * Remove a custom exercise template definition.
   */
  public deleteCustomExercise = async (
    req: AuthenticatedRequest, // Fixed: Changed from Request to AuthenticatedRequest
    res: Response,
  ): Promise<void> => {
    try {
      const creatorId = req.user?.id;
      const id = parseInt(req.params.id as string, 10); // Added type assertion safely

      if (!creatorId) {
        res.status(401).json({ error: "Unauthorized. User ID missing." });
        return;
      }

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid Exercise ID provided." });
        return;
      }

      const deletedExercise = await this.workoutService.deleteCustomExercise(
        id,
        creatorId,
      );
      res.status(200).json(deletedExercise);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };
}
