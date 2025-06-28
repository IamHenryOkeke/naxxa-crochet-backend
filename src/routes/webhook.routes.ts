import express, { Router } from "express";
import * as orderControllers from "../controllers/order.controllers";

const webhookRouter = Router();

webhookRouter.post(
  "/paystack",
  express.raw({ type: "application/json" }),
  orderControllers.handlePaystackWebhook,
);

export default webhookRouter;
