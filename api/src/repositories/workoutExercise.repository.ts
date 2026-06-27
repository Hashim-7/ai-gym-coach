import { PrismaClient } from "../../generated/prisma/index.js";
import type { WorkoutExercise } from "../../generated/prisma/index.js";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export class WorkoutExerciseRepository {
  // create a new instance of an exercise within a workout
  async create(
    templateId: string,
    exerciseId: number,
    order: number,
    targetSets: number,
    targetReps: number,
    targetWeight: number,
  ): Promise<WorkoutExercise> {
    return prisma.workoutExercise.create({
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
