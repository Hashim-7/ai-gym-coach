import { PrismaClient } from "../../generated/prisma/index.js";
import type { User } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();

export class UserRepository {
  private normalise = (email: string): string => email.trim().toLowerCase();

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email: this.normalise(email) } });
  }

  async create(
    email: string,
    passwordHash: string,
    name: string,
  ): Promise<User> {
    return prisma.user.create({
      data: {
        email: this.normalise(email),
        passwordHash,
        name,
      },
    });
  }
}
