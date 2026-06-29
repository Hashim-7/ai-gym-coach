import type { Request, Response } from "express";
import { WorkoutService } from "../services/workout.service.js";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export class WorkoutSessionController {
  private workoutService = new WorkoutService();

  // POST /api/workout-sessions
  public startWorkoutSession = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const creatorId = req.user?.id;
      const { templateId } = req.body;

      if (!creatorId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const session = await this.workoutService.startWorkoutSession(
        creatorId,
        templateId,
      );
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // GET /api/workout-sessions
  public getWorkoutHistory = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const creatorId = req.user?.id;

      if (!creatorId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const history = await this.workoutService.getWorkoutHistory(creatorId);
      res.status(200).json(history);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // GET /api/workout-sessions/:id
  public getWorkoutSessionDetails = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const creatorId = req.user?.id;
      const id = parseInt(req.params.id as string, 10);

      if (!creatorId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const session = await this.workoutService.getWorkoutSessionDetails(
        id,
        creatorId,
      );
      res.status(200).json(session);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // DELETE /api/workout-sessions/:id
  public deleteWorkoutSession = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const creatorId = req.user?.id;
      const id = parseInt(req.params.id as string, 10);

      if (!creatorId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const deletedSession = await this.workoutService.deleteWorkoutSession(
        id,
        creatorId,
      );
      res.status(200).json(deletedSession);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // POST /api/workout-sessions/:id/sets
  public logSet = async (req: Request, res: Response): Promise<void> => {
    try {
      const workoutId = parseInt(req.params.id as string, 10);
      const { exerciseId, setNumber, weight, reps } = req.body;

      const loggedSet = await this.workoutService.logSet(
        workoutId,
        Number(exerciseId),
        Number(setNumber),
        Number(weight),
        Number(reps),
      );
      res.status(201).json(loggedSet);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // PATCH /api/workout-sessions/sets/:setId
  public updateLoggedSet = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { setId } = req.params;
      const { weight, reps } = req.body;

      const updatedSet = await this.workoutService.updateLoggedSet(
        setId as string,
        Number(weight),
        Number(reps),
      );
      res.status(200).json(updatedSet);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // DELETE /api/workout-sessions/sets/:setId
  public removeLoggedSet = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { setId } = req.params;

      const removedSet = await this.workoutService.removeLoggedSet(
        setId as string,
      );
      res.status(200).json(removedSet);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };
}
