import type { WorkoutTemplate } from "../../generated/prisma/index.js";
import { prisma } from "../db.js";

export class WorkoutTemplateRepository {
  // transaction wrapper that passes the internal client back
  async transaction<T>(callback: (tx: any) => Promise<T>): Promise<T> {
    return prisma.$transaction(callback);
  }

  // creates a workout template
  async create(
    creatorId: string,
    name: string,
    tx?: any, // optional prisma transaction client
  ): Promise<WorkoutTemplate> {
    const client = tx ?? prisma; // fallback to default if no transaction
    return client.workoutTemplate.create({
      data: {
        creatorId,
        name,
      },
    });
  }

  // returns all of the workout templates
  async readAll(creatorId: string): Promise<WorkoutTemplate[]> {
    return prisma.workoutTemplate.findMany({
      where: {
        creatorId,
      },
    });
  }

  // returns a specific workout template and its exercises
  async readById(
    id: string,
    creatorId: string,
  ): Promise<WorkoutTemplate | null> {
    return prisma.workoutTemplate.findFirst({
      where: {
        id,
        creatorId,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });
  }

  // for updating the workout template's name not the exercises within it
  async update(
    id: string,
    creatorId: string,
    name: string,
  ): Promise<WorkoutTemplate> {
    return prisma.workoutTemplate.update({
      where: {
        id,
        creatorId,
      },
      data: {
        name,
      },
    });
  }

  // deletes a workout template
  async delete(id: string, creatorId: string): Promise<WorkoutTemplate> {
    return prisma.workoutTemplate.delete({
      where: {
        id,
        creatorId,
      },
    });
  }
}
