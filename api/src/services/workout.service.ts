import { ExerciseRepository } from "../repositories/exercise.repository.js";
import { SetRepository } from "../repositories/set.repository.js";
import { WorkoutExerciseRepository } from "../repositories/workoutExercise.repository.js";
import { WorkoutSessionRepository } from "../repositories/workoutSession.repository.js";
import { WorkoutTemplateRepository } from "../repositories/workoutTemplate.repository.js";
import type {
  Exercise,
  Set,
  WorkoutExercise,
  WorkoutSession,
  WorkoutTemplate,
} from "../../generated/prisma/index.js";

export class WorkoutService {
  private exerciseRepo = new ExerciseRepository();
  private setRepo = new SetRepository();
  private workoutExerciseRepo = new WorkoutExerciseRepository();
  private sessionRepo = new WorkoutSessionRepository();
  private templateRepo = new WorkoutTemplateRepository();

  async createTemplate(
    creatorId: string,
    name: string,
    exercises: Array<{
      exerciseId: number;
      order: number;
      targetSets: number;
      targetReps: number;
      targetWeight: number;
    }>,
  ): Promise<WorkoutTemplate> {
    if (!creatorId || !name.trim()) {
      throw new Error("Creator ID and a valid template name are required.");
    }
    if (!exercises || exercises.length === 0) {
      throw new Error("A template must include at least one exercise.");
    }

    return this.templateRepo.transaction(async (tx) => {
      try {
        const template = await this.templateRepo.create(
          creatorId,
          name.trim(),
          tx,
        );

        for (const entry of exercises) {
          if (
            entry.exerciseId <= 0 ||
            entry.order < 0 ||
            entry.targetSets < 0 ||
            entry.targetReps < 0 ||
            entry.targetWeight < 0
          ) {
            throw new Error(
              `Invalid data provided for exercise ID ${entry.exerciseId}. Values cannot be negative.`,
            );
          }

          await this.workoutExerciseRepo.create(
            template.id,
            entry.exerciseId,
            entry.order,
            entry.targetSets,
            entry.targetReps,
            entry.targetWeight,
            tx,
          );
        }

        return template;
      } catch (error) {
        throw new Error(
          `Failed to create workout template: ${(error as Error).message}`,
        );
      }
    });
  }

  async getUserTemplates(creatorId: string): Promise<WorkoutTemplate[]> {
    if (!creatorId) throw new Error("Creator ID is required.");
    try {
      return await this.templateRepo.readAll(creatorId);
    } catch (error) {
      throw new Error(`Failed to fetch templates: ${(error as Error).message}`);
    }
  }

  async getTemplateDetails(
    templateId: string,
    creatorId: string,
  ): Promise<WorkoutTemplate | null> {
    if (!templateId || !creatorId)
      throw new Error("Template ID and Creator ID are required.");
    try {
      const template = await this.templateRepo.readById(templateId, creatorId);
      if (!template) throw new Error("Template not found or access denied.");
      return template;
    } catch (error) {
      throw new Error(
        `Failed to fetch template details: ${(error as Error).message}`,
      );
    }
  }

  async updateTemplateName(
    id: string,
    creatorId: string,
    name: string,
  ): Promise<WorkoutTemplate> {
    if (!id || !creatorId || !name.trim()) {
      throw new Error(
        "Template ID, Creator ID, and a valid new name are required.",
      );
    }
    try {
      return await this.templateRepo.update(id, creatorId, name.trim());
    } catch (error) {
      throw new Error(
        `Failed to update template name: ${(error as Error).message}`,
      );
    }
  }

  async addExerciseToTemplate(
    templateId: string,
    data: {
      exerciseId: number;
      order: number;
      targetSets: number;
      targetReps: number;
      targetWeight: number;
    },
  ): Promise<WorkoutExercise> {
    if (!templateId) throw new Error("Template ID is required.");
    if (
      data.exerciseId <= 0 ||
      data.order < 0 ||
      data.targetSets < 0 ||
      data.targetReps < 0 ||
      data.targetWeight < 0
    ) {
      throw new Error(
        "Invalid exercise attributes. Numerical fields cannot be negative.",
      );
    }

    try {
      return await this.workoutExerciseRepo.create(
        templateId,
        data.exerciseId,
        data.order,
        data.targetSets,
        data.targetReps,
        data.targetWeight,
      );
    } catch (error) {
      throw new Error(
        `Failed to add exercise to template: ${(error as Error).message}`,
      );
    }
  }

  async removeExerciseFromTemplate(
    workoutExerciseId: string,
  ): Promise<WorkoutExercise> {
    if (!workoutExerciseId) throw new Error("Workout Exercise ID is required.");
    try {
      return await this.workoutExerciseRepo.delete(workoutExerciseId);
    } catch (error) {
      throw new Error(
        `Failed to remove exercise from template: ${(error as Error).message}`,
      );
    }
  }

  async updateTemplateExerciseTargets(
    id: string,
    data: {
      order?: number;
      targetSets?: number;
      targetReps?: number;
      targetWeight?: number;
    },
  ): Promise<WorkoutExercise> {
    if (!id) throw new Error("Workout Exercise ID is required.");

    if (data.order !== undefined && data.order < 0)
      throw new Error("Order cannot be negative.");
    if (data.targetSets !== undefined && data.targetSets < 0)
      throw new Error("Target sets cannot be negative.");
    if (data.targetReps !== undefined && data.targetReps < 0)
      throw new Error("Target reps cannot be negative.");
    if (data.targetWeight !== undefined && data.targetWeight < 0)
      throw new Error("Target weight cannot be negative.");

    try {
      return await this.workoutExerciseRepo.update(id, data);
    } catch (error) {
      throw new Error(
        `Failed to update exercise targets: ${(error as Error).message}`,
      );
    }
  }

  async deleteTemplate(
    id: string,
    creatorId: string,
  ): Promise<WorkoutTemplate> {
    if (!id || !creatorId)
      throw new Error("Template ID and Creator ID are required.");
    try {
      return await this.templateRepo.delete(id, creatorId);
    } catch (error) {
      throw new Error(`Failed to delete template: ${(error as Error).message}`);
    }
  }

  async startWorkoutSession(
    creatorId: string,
    templateId: string,
  ): Promise<WorkoutSession> {
    if (!creatorId || !templateId)
      throw new Error("Creator ID and Template ID are required.");
    try {
      return await this.sessionRepo.create(creatorId, templateId);
    } catch (error) {
      throw new Error(
        `Failed to start workout session: ${(error as Error).message}`,
      );
    }
  }

  async logSet(
    workoutId: number,
    exerciseId: number,
    setNumber: number,
    weight: number,
    reps: number,
  ): Promise<Set> {
    if (workoutId <= 0 || exerciseId <= 0)
      throw new Error("Invalid Workout ID or Exercise ID.");
    if (setNumber <= 0) throw new Error("Set number must be greater than 0.");
    if (weight < 0 || reps < 0)
      throw new Error("Weight and reps cannot be negative.");

    try {
      return await this.setRepo.create(
        workoutId,
        exerciseId,
        setNumber,
        weight,
        reps,
      );
    } catch (error) {
      throw new Error(`Failed to log set: ${(error as Error).message}`);
    }
  }

  async updateLoggedSet(
    setId: string,
    weight: number,
    reps: number,
  ): Promise<Set> {
    if (!setId) throw new Error("Set ID is required.");
    if (weight < 0 || reps < 0)
      throw new Error("Weight and reps cannot be negative.");

    try {
      return await this.setRepo.update(setId, weight, reps);
    } catch (error) {
      throw new Error(
        `Failed to update logged set: ${(error as Error).message}`,
      );
    }
  }

  async removeLoggedSet(setId: string): Promise<Set> {
    if (!setId) throw new Error("Set ID is required.");
    try {
      return await this.setRepo.delete(setId);
    } catch (error) {
      throw new Error(
        `Failed to remove logged set: ${(error as Error).message}`,
      );
    }
  }

  async getWorkoutHistory(creatorId: string): Promise<WorkoutSession[]> {
    if (!creatorId) throw new Error("Creator ID is required.");
    try {
      return await this.sessionRepo.readAll(creatorId);
    } catch (error) {
      throw new Error(
        `Failed to fetch workout history: ${(error as Error).message}`,
      );
    }
  }

  async getWorkoutSessionDetails(
    id: number,
    creatorId: string,
  ): Promise<WorkoutSession | null> {
    if (id <= 0 || !creatorId)
      throw new Error("Valid Workout Session ID and Creator ID are required.");
    try {
      const session = await this.sessionRepo.readById(id, creatorId);
      if (!session)
        throw new Error("Workout session not found or access denied.");
      return session;
    } catch (error) {
      throw new Error(
        `Failed to fetch workout session details: ${(error as Error).message}`,
      );
    }
  }

  async deleteWorkoutSession(
    id: number,
    creatorId: string,
  ): Promise<WorkoutSession> {
    if (id <= 0 || !creatorId)
      throw new Error("Valid Workout Session ID and Creator ID are required.");
    try {
      return await this.sessionRepo.delete(id, creatorId);
    } catch (error) {
      throw new Error(
        `Failed to delete workout session: ${(error as Error).message}`,
      );
    }
  }

  async getAvailableExercises(creatorId: string): Promise<Exercise[]> {
    if (!creatorId) throw new Error("Creator ID is required.");
    try {
      return await this.exerciseRepo.readAll(creatorId);
    } catch (error) {
      throw new Error(`Failed to fetch exercises: ${(error as Error).message}`);
    }
  }

  async createCustomExercise(
    creatorId: string,
    name: string,
    notes: string,
    muscleGroup: string,
  ): Promise<Exercise> {
    if (!creatorId || !name.trim() || !muscleGroup.trim()) {
      throw new Error(
        "Creator ID, exercise name, and muscle group are required.",
      );
    }
    try {
      return await this.exerciseRepo.create(
        creatorId,
        name.trim(),
        notes?.trim() || "",
        muscleGroup.trim(),
      );
    } catch (error) {
      throw new Error(
        `Failed to create custom exercise: ${(error as Error).message}`,
      );
    }
  }

  async updateCustomExercise(
    id: number,
    creatorId: string,
    data: {
      name?: string;
      muscleGroup?: string;
      notes?: string;
    },
  ): Promise<Exercise> {
    if (id <= 0 || !creatorId)
      throw new Error("Valid Exercise ID and Creator ID are required.");

    if (data.name !== undefined && !data.name.trim())
      throw new Error("Exercise name cannot be empty.");
    if (data.muscleGroup !== undefined && !data.muscleGroup.trim())
      throw new Error("Muscle group cannot be empty.");

    try {
      const updatedData: typeof data = {};

      if (data.name !== undefined) updatedData.name = data.name.trim();
      if (data.muscleGroup !== undefined)
        updatedData.muscleGroup = data.muscleGroup.trim();
      if (data.notes !== undefined) updatedData.notes = data.notes.trim();

      return await this.exerciseRepo.update(id, creatorId, updatedData);
    } catch (error) {
      throw new Error(
        `Failed to update custom exercise: ${(error as Error).message}`,
      );
    }
  }

  async deleteCustomExercise(id: number, creatorId: string): Promise<Exercise> {
    if (id <= 0 || !creatorId)
      throw new Error("Valid Exercise ID and Creator ID are required.");
    try {
      return await this.exerciseRepo.delete(id, creatorId);
    } catch (error) {
      throw new Error(
        `Failed to delete custom exercise: ${(error as Error).message}`,
      );
    }
  }
}
