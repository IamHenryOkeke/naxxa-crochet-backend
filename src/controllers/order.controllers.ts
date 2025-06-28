import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import * as orderService from "../services/order.services";
import { AppError } from "../error/errorHandler";
import crypto from "crypto";
import { sendMail } from "../lib/nodemailer";
import { z } from "zod";
import * as schemas from "../lib/schemas";

export const createOrder = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user as Express.User;
    const {
      orderItems,
      userFirstName,
      userLastName,
      userEmail,
      userAddress,
      userCity,
      userState,
      userPhone,
      userWhatsappPhone,
      notes,
      total,
    } = req.body;

    const newOrder = await orderService.createOrder(user, {
      orderItems,
      userFirstName,
      userLastName,
      userEmail,
      userAddress,
      userCity,
      userState,
      userPhone,
      userWhatsappPhone,
      notes,
      total,
    });

    if (!newOrder) {
      throw new AppError("Failed to create order", 400);
    }

    res.status(201).json({
      message: "Order created. Redirect to payment.",
      data: newOrder,
    });
  },
);

export const getAllOrders = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user as Express.User;

    const { page, limit, search, deliveryStatus, paymentStatus } =
      req.query as unknown as z.infer<typeof schemas.getAllOrdersQuerySchema>;

    const result = await orderService.getAllOrders({
      user,
      page,
      limit,
      search,
      deliveryStatus,
      paymentStatus,
    });

    res.status(200).json({
      message: "Orders fetched successfully",
      ...result,
    });
  },
);

export const getOrderById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { orderId } = req.params;
    const user = req.user as Express.User | null;

    const order = await orderService.getOrderByOrderId(orderId, user);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    res.status(200).json({
      message: "Order fetched successfully",
      order,
    });
  },
);

export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { orderId } = req.params;
    const { paymentStatus, deliveryStatus } = req.body;

    const updatedOrder = await orderService.updateOrderStatus(orderId, {
      ...(paymentStatus && { paymentStatus }),
      ...(deliveryStatus && { deliveryStatus }),
    });

    if (!updatedOrder) {
      throw new AppError("Order not found or failed to update", 404);
    }

    res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  },
);

export const handlePaystackWebhook = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      throw new Error("PAYSTACK_SECRET_KEY is not defined");
    }

    const signature = req.headers["x-paystack-signature"] as string;
    const rawBody = req.body as Buffer;

    const computedSignature = crypto
      .createHmac("sha512", secretKey)
      .update(rawBody)
      .digest("hex");

    if (computedSignature !== signature) {
      console.warn("Invalid Paystack signature");
      throw new AppError("Invalid Paystack signature", 401);
    }

    const event = JSON.parse(rawBody.toString("utf-8"));

    if (event.event === "charge.success") {
      const orderId = event.data.metadata?.orderId;
      if (!orderId) throw new AppError("Order ID missing in metadata", 400);

      try {
        const data = await orderService.updateOrderStatus(orderId, {
          paymentStatus: "Paid",
        });

        await sendMail(
          "Order Confirmation",
          `${data.userFirstName} ${data.userLastName}`,
          data.userEmail,
          `Your order with ID ${data.id} has been successfully paid for. Thank you for shopping with us.`,
        );

        res.status(200).json({ message: "Payment verified and order updated" });
        return;
      } catch (err) {
        console.error("Error processing Paystack webhook:", err);
        res.status(500).json({ message: "Error processing payment" });
        return;
      }
    }

    res.status(200).json({ message: "Event ignored" });
  },
);

export const deleteOrderUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { orderId } = req.params;
    const user = req.user as Express.User;

    const deletedOrder = await orderService.deleteOrderUser(user, orderId);

    if (!deletedOrder) {
      throw new AppError("Order not found or failed to delete", 404);
    }

    res.status(200).json({
      message: "Order deleted successfully",
    });
  },
);

export const deleteOrderAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { orderId } = req.params;

    const deletedOrder = await orderService.deleteOrderAdmin(orderId);

    if (!deletedOrder) {
      throw new AppError("Order not found or failed to delete", 404);
    }

    res.status(200).json({
      message: "Order deleted successfully",
      order: deletedOrder,
    });
  },
);
