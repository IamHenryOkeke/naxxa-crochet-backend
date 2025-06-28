import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import passport from "./config/passport-config";
import corsOptions from "./config/cors";

import { CustomError } from "./lib/type";

import * as routes from "./routes";

const app = express();
app.use(cors(corsOptions));

app.use("/api/webhook", routes.webhookRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use("/api/auth", routes.authRouter);
app.use("/api/cart", routes.cartRouter);
app.use("/api/categories", routes.categoryRouter);
app.use("/api/orders", routes.orderRouter);
app.use("/api/products", routes.productRouter);
app.use("/api/reviews", routes.reviewRouter);
app.use("/api/user", routes.userRouter);
app.use("/api", routes.indexRouter);

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
