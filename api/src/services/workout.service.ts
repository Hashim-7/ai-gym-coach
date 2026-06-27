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
    return this.templateRepo.transaction(async (tx) => {
      const template = await this.templateRepo.create(creatorId, name, tx);

      for (const entry of exercises) {
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
    });
  }

  async getUserTemplates(creatorId: string): Promise<WorkoutTemplate[]> {
    return this.templateRepo.readAll(creatorId);
  }

  async getTemplateDetails(
    templateId: string,
    creatorId: string,
  ): Promise<WorkoutTemplate | null> {
    return this.templateRepo.readById(templateId, creatorId);
  }

  async updateTemplateName(
    id: string,
    creatorId: string,
    name: string,
  ): Promise<WorkoutTemplate> {
    return this.templateRepo.update(id, creatorId, name);
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
    return this.workoutExerciseRepo.create(
      templateId,
      data.exerciseId,
      data.order,
      data.targetSets,
      data.targetReps,
      data.targetWeight,
    );
  }

  async removeExerciseFromTemplate(
    workoutExerciseId: string,
  ): Promise<WorkoutExercise> {
    return this.workoutExerciseRepo.delete(workoutExerciseId);
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
    return this.workoutExerciseRepo.update(id, data);
  }

  async deleteTemplate(
    id: string,
    creatorId: string,
  ): Promise<WorkoutTemplate> {
    return this.templateRepo.delete(id, creatorId);
  }

  async startWorkoutSession(
    creatorId: string,
    templateId: string,
  ): Promise<WorkoutSession> {
    return this.sessionRepo.create(creatorId, templateId);
  }

  async logSet(
    workoutId: number,
    exerciseId: number,
    setNumber: number,
    weight: number,
    reps: number,
  ): Promise<Set> {
    return this.setRepo.create(workoutId, exerciseId, setNumber, weight, reps);
  }

  async updateLoggedSet(
    setId: string,
    weight: number,
    reps: number,
  ): Promise<Set> {
    return this.setRepo.update(setId, weight, reps);
  }

  async removeLoggedSet(setId: string): Promise<Set> {
    return this.setRepo.delete(setId);
  }

  async getWorkoutHistory(creatorId: string): Promise<WorkoutSession[]> {
    return this.sessionRepo.readAll(creatorId);
  }

  async getWorkoutSessionDetails(
    id: number,
    creatorId: string,
  ): Promise<WorkoutSession | null> {
    return this.sessionRepo.readById(id, creatorId);
  }

  async deleteWorkoutSession(
    id: number,
    creatorId: string,
  ): Promise<WorkoutSession> {
    return this.sessionRepo.delete(id, creatorId);
  }

  async getAvailableExercises(creatorId: string): Promise<Exercise[]> {
    return this.exerciseRepo.readAll(creatorId);
  }

  async createCustomExercise(
    creatorId: string,
    name: string,
    notes: string,
    muscleGroup: string,
  ): Promise<Exercise> {
    return this.exerciseRepo.create(creatorId, name, notes, muscleGroup);
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
    return this.exerciseRepo.update(id, creatorId, data);
  }

  async deleteCustomExercise(id: number, creatorId: string): Promise<Exercise> {
    return this.exerciseRepo.delete(id, creatorId);
  }
}
