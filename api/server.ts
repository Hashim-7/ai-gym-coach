import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import apiRouter from "./src/routes/index.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());

// cors due to front and back end using different urls
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
