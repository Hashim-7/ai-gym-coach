import { Router } from "express";
import authRouter from "./auth.routes.js";
import exerciseRouter from "./exercise.routes.js";
import sessionRouter from "./workoutSession.routes.js";
import templateRouter from "./workoutTemplate.routes.js";

const apiRouter = Router();

// Public / Rate-limited routes
apiRouter.use("/auth", authRouter);

// Protected app resource routes
apiRouter.use("/exercises", exerciseRouter);
apiRouter.use("/workout-sessions", sessionRouter);
apiRouter.use("/workout-templates", templateRouter);

export default apiRouter;
