import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository.js";
import type { User } from "../../generated/prisma/index.js";

export class AuthService {
  private userRepo = new UserRepository();

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // returns newly created user
  async register(email: string, password: string, name: string): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    if (!normalizedName) {
      throw new Error("Name is required");
    }

    if (!normalizedEmail || !this.isValidEmail(normalizedEmail)) {
      throw new Error("A valid email address is required");
    }

    const existingUser = await this.userRepo.findByEmail(normalizedEmail);
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
      throw new Error(
        "Password must be at least 8 characters long and contain an uppercase letter, lowercase letter, number, and special character.",
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await this.userRepo.create(
      normalizedEmail,
      passwordHash,
      normalizedName,
    );
    return newUser;
  }

  // returns jwt token of logging in user
  async login(email: string, password: string, rememberMe: boolean) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.userRepo.findByEmail(normalizedEmail);
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

    const tokenExpiry = rememberMe ? "30d" : "1d";
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: tokenExpiry,
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
