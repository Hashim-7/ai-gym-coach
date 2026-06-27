import type { Set } from "../../generated/prisma/index.js";
import { prisma } from "../db.js";

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
