import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name, username } = req.body;

      // hidden message to prevent botspam with hidden field (honeypot)
      if (username) {
        res.status(201).json({ message: "Registration successful" });
        return;
      }

      const user = await authService.register(email, password, name);
      res.status(201).json(user);
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : "Registration failed";
      res.status(400).json({ message: errMsg });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, username, rememberMe } = req.body;

      // hidden message to prevent botspam with hidden field (honeypot)
      if (username) {
        res.status(400).json({ message: "Bad Request" });
        return;
      }

      // browser treats session differently if remember me checked
      const isPersistent = !!rememberMe;

      const { token, cookieOptions } = await authService.login(
        email,
        password,
        isPersistent,
      );

      res.cookie("token", token, cookieOptions);
      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "";

      if (errMsg === "JWT_SECRET is missing" || errMsg.includes("database")) {
        res.status(500).json({ message: "An internal server error occurred" });
        return;
      }

      res.status(401).json({ message: errMsg || "Invalid email or password" });
    }
  }
}
