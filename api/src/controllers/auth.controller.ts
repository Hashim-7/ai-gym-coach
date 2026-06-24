import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name, username } = req.body;

      if (username) {
        res.status(201).json({ message: "Registration successful" });
        return;
      }

      const user = await authService.register(email, password, name);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, username } = req.body;

      if (username) {
        res.status(200).json({ message: "Login successful" });
        return;
      }

      const { token, cookieOptions } = await authService.login(email, password);

      res.cookie("token", token, cookieOptions);
      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      res.status(401).json({ message: (error as Error).message });
    }
  }
}
