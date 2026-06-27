import { PrismaClient } from "../../generated/prisma/index.js";
import type { WorkoutSession } from "../../generated/prisma/index.js";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export class WorkoutSessionRepository {
  // create an instance/session of a workout template
  async create(
    creatorId: string,
    templateId: string,
    date = new Date(),
  ): Promise<WorkoutSession> {
    return prisma.workoutSession.create({
      data: {
        creatorId,
        templateId,
        date,
      },
    });
  }

  // returns all the workout sessions the user has performed
  async readAll(creatorId: string): Promise<WorkoutSession[]> {
    return prisma.workoutSession.findMany({
      where: {
        creatorId,
      },
      include: {
        sets: true,
        template: true,
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  // returns the info about one specific user workout instance
  async readById(
    id: number,
    creatorId: string,
  ): Promise<WorkoutSession | null> {
    return prisma.workoutSession.findFirst({
      where: {
        id,
        creatorId,
      },
      include: {
        sets: true,
        template: true,
      },
    });
  }

  // updates a specific workout session's info
  async update(
    id: number,
    creatorId: string,
    date: Date,
  ): Promise<WorkoutSession> {
    return prisma.workoutSession.update({
      where: {
        id,
        creatorId,
      },
      data: {
        date,
      },
    });
  }

  // deletes a workout session
  async delete(id: number, creatorId: string): Promise<WorkoutSession> {
    return prisma.workoutSession.delete({
      where: {
        id,
        creatorId,
      },
    });
  }
}
