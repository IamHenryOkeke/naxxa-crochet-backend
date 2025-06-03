import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import passport from "./config/passport-config";
import corsOptions from "./config/cors";

import { CustomError } from "./lib/type";

import indexRouter from "./routes/index.routes";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";

const app = express();
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api", indexRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: "The route you are looking for does not exist.",
  });
});

app.use(
  (err: CustomError, _req: Request, res: Response, _next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      statusCode,
      message: err.message || "Something went wrong",
      details: err.details ?? undefined,
    });
  },
);

export default app;
