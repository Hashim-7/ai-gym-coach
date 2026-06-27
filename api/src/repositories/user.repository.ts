import type { User } from "../../generated/prisma/index.js";
import { prisma } from "../db.js";

export class UserRepository {
  // to prevent storing duplicate emails
  private normalise = (email: string): string => email.trim().toLowerCase();

  // to check email exists/doesn't exist on db
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
