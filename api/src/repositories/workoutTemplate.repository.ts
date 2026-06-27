import { PrismaClient } from "../../generated/prisma/index.js";
import type { WorkoutTemplate } from "../../generated/prisma/index.js";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export class WorkoutTemplateRepository {
  // creates a workout template
  async create(creatorId: string, name: string): Promise<WorkoutTemplate> {
    return prisma.workoutTemplate.create({
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
