import { PrismaClient } from "../../generated/prisma/index.js";
import type { Exercise } from "../../generated/prisma/index.js";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export class ExerciseRepository {
  // create a custom exercise
  async create(
    creatorId: string,
    name: string,
    notes: string,
    muscleGroup: string,
  ): Promise<Exercise> {
    return prisma.exercise.create({
      data: {
        creatorId,
        name,
        notes,
        muscleGroup,
      },
    });
  }

  // returns all of the available exercises, both defaults and user created
  async readAll(creatorId: string): Promise<Exercise[]> {
    return prisma.exercise.findMany({
      where: {
        OR: [
          { creatorId },
          { creatorId: null }, // global exercises
        ],
      },
    });
  }

  // update the info about an exercise
  async update(
    id: number,
    creatorId: string,
    data: {
      name?: string;
      muscleGroup?: string;
      notes?: string;
    },
  ): Promise<Exercise> {
    return prisma.exercise.update({
      where: {
        id,
        creatorId,
      },
      data,
    });
  }

  // delete a specific exercise
  async delete(id: number, creatorId: string): Promise<Exercise> {
    return prisma.exercise.delete({
      where: {
        id,
        creatorId,
      },
    });
  }
}
