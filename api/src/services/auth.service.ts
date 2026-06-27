import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository.js";
import type { User } from "../../generated/prisma/index.js";

export class AuthService {
  private userRepo = new UserRepository();

  // returns newly created user
  async register(email: string, password: string, name: string): Promise<User> {
    if (!name.trim()) {
      throw new Error("Name is required");
    }

    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new Error("An account is already registered with this email");
    }

    const strongPassword =
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password);

    if (!strongPassword) {
      throw new Error(`Password must:
Be at least 8 characters long
Contain at least one uppercase letter
Contain at least one lowercase letter
Contain at least one number
Contain at least one special character`);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await this.userRepo.create(email, passwordHash, name);
    return newUser;
  }

  async login(email: string, password: string, rememberMe: boolean) {
    // returns jwt token of logging in user
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw new Error("Invalid email or password");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return {
      token,
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
        ...(rememberMe ? { maxAge: 30 * 24 * 60 * 60 * 1000 } : {}),
      },
    };
  }
}
