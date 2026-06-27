import { PrismaClient } from "../../generated/prisma/index.js";
import type { Set } from "../../generated/prisma/index.js";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export class SetRepository {
  // create a set with its stats
  async create(
    workoutId: number,
    exerciseId: number,
    setNumber: number,
    weight: number,
    reps: number,
  ): Promise<Set> {
    return prisma.set.create({
      data: {
        workoutId,
        exerciseId,
        setNumber,
        weight,
        reps,
      },
    });
  }

  // returns all the sets in the workout
  async readByWorkout(workoutId: number): Promise<Set[]> {
    return prisma.set.findMany({
      where: {
        workoutId,
      },
    });
  }

  // update the stats of a specific set
  async update(id: string, weight: number, reps: number): Promise<Set> {
    return prisma.set.update({
      where: {
        id,
      },
      data: {
        weight,
        reps,
      },
    });
  }

  // delete a specific set
  async delete(id: string): Promise<Set> {
    return prisma.set.delete({
      where: {
        id,
      },
    });
  }
}
