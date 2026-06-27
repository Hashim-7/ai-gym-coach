import type { WorkoutExercise } from "../../generated/prisma/index.js";
import { prisma } from "../db.js";

export class WorkoutExerciseRepository {
  // create a new instance of an exercise within a workout
  async create(
    templateId: string,
    exerciseId: number,
    order: number,
    targetSets: number,
    targetReps: number,
    targetWeight: number,
    tx?: any, // optional prisma transaction client
  ): Promise<WorkoutExercise> {
    const client = tx ?? prisma; // fallback to default if no transaction
    return client.workoutExercise.create({
      data: {
        templateId,
        exerciseId,
        order,
        targetSets,
        targetReps,
        targetWeight,
      },
    });
  }

  // returns all of the exercises within a workout
  async readByTemplate(templateId: string): Promise<WorkoutExercise[]> {
    return prisma.workoutExercise.findMany({
      where: {
        templateId,
      },
      include: {
        exercise: true,
      },
      orderBy: {
        order: "asc",
      },
    });
  }

  // update an exercise's workout-related info
  async update(
    id: string,
    data: {
      order?: number;
      targetSets?: number;
      targetReps?: number;
      targetWeight?: number;
    },
  ): Promise<WorkoutExercise> {
    return prisma.workoutExercise.update({
      where: {
        id,
      },
      data,
    });
  }

  // remove an exercise from a workout
  async delete(id: string): Promise<WorkoutExercise> {
    return prisma.workoutExercise.delete({
      where: {
        id,
      },
    });
  }
}
