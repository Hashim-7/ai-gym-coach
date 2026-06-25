import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { rateLimiter } from "../middleware/rateLimiter.js";

const router = Router();
const authController = new AuthController();

// rate limiting middleware for auth routes to prevent spam
router.post(
  "/register",
  rateLimiter,
  authController.register.bind(authController),
);
router.post("/login", rateLimiter, authController.login.bind(authController));

export default router;
