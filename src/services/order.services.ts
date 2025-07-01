import * as orderQueries from "../db/order.queries";
import { AppError } from "../error/errorHandler";
import { Prisma, Size, PAYMENTSTATUS, ORDERSTATUS } from "../generated/prisma";
import prisma from "../lib/prisma";
import fetchWithRetry from "../utils/fetchWithRetry";
import generateOrderReference from "../utils/ref";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

type CreateOrderInput = Omit<
  Prisma.OrderCreateInput,
  "paymentId" | "orderItems"
> & {
  orderItems: {
    productId: string;
    quantity: number;
    price: number;
    size?: string | null;
  }[];
};

export const createOrder = async (
  user: Express.User | null,
  data: CreateOrderInput,
) => {
  const paymentId = generateOrderReference();

  const result = await prisma.$transaction(async (tx) => {
    // Check stock before creating order
    for (const item of data.orderItems) {
      const stockEntry = await tx.productSize.findUnique({
        where: {
          productId_size: {
            productId: item.productId,
            size: item.size as Size,
          },
        },
      });

      if (!stockEntry || stockEntry.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock for ${item.size} of product`,
          400,
        );
      }
    }

    // Create order
    const newOrder = await orderQueries.createOrder(tx, {
      ...data,
      paymentId,
      orderItems: {
        create: data.orderItems.map((item) => ({
          quantity: item.quantity,
          price: item.price,
          size: item.size as Size,
          product: { connect: { id: item.productId } },
        })),
      },
      user: user ? { connect: { id: user.id } } : undefined,
    });

    // Decrement stock
    await Promise.all(
      data.orderItems.map((item) =>
        tx.productSize.updateMany({
          where: {
            productId: item.productId,
            size: item.size as Size,
            stock: { gte: item.quantity },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        }),
      ),
    );

    return newOrder;
  });

  if (!result) {
    throw new AppError("Failed to create order", 400);
  }

  // Prepare Paystack transaction
  const params = JSON.stringify({
    email: result.userEmail,
    amount: result.total * 100,
    reference: result.paymentId,
    callback_url: "https://yourdomain.com/cart/checkout/success",
    metadata: {
      cancel_action: "https://yourdomain.com/cart/checkout?cancelled=true",
      orderId: result.id,
      orderItem: result.orderItems.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
      })),
      custom_fields: result.orderItems.map((item) => ({
        display_name: item.product.name,
        variable_name: item.product.name,
        value: `₦${item.price}`,
      })),
    },
    channels: ["card", "bank"],
  });

  const response = await fetchWithRetry(
    "https://api.paystack.co/transaction/initialize",
    {
      method: "POST",
      body: params,
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
    },
    3,
    1000,
  );

  const paystackData = await response.json();

  if (!response.ok || !paystackData.data?.authorization_url) {
    console.error("Paystack Init Error:", paystackData);
    throw new AppError(
      paystackData.message || "Failed to initialize Paystack transaction",
      500,
    );
  }

  const { authorization_url, reference: confirmedReference } =
    paystackData.data;

  return {
    authorizationUrl: authorization_url,
    reference: confirmedReference,
    orderId: result.id,
  };
};

type GetAllOrdersOptions = {
  user: Express.User;
  page: number;
  limit: number;
  searchTerm?: string;
  paymentStatus?: string;
  deliveryStatus?: string;
};

export const getAllOrders = async ({
  user,
  page,
  limit,
  searchTerm,
  paymentStatus,
  deliveryStatus,
}: GetAllOrdersOptions) => {
  const skip = (page - 1) * limit;

  const where: Prisma.OrderWhereInput = {
    ...(user.role === "USER" && { userId: user.id }),
    ...(user.role === "USER" && { deletedAt: null }),
    ...(paymentStatus && { paymentStatus: paymentStatus as PAYMENTSTATUS }),
    ...(deliveryStatus && { deliveryStatus: deliveryStatus as ORDERSTATUS }),
    ...(searchTerm && {
      OR: [
        { userFirstName: { contains: searchTerm, mode: "insensitive" } },
        { userLastName: { contains: searchTerm, mode: "insensitive" } },
        { userEmail: { contains: searchTerm, mode: "insensitive" } },
        { userPhone: { contains: searchTerm, mode: "insensitive" } },
        { userWhatsappPhone: { contains: searchTerm, mode: "insensitive" } },
        { userAddress: { contains: searchTerm, mode: "insensitive" } },
        { userCity: { contains: searchTerm, mode: "insensitive" } },
        { userState: { contains: searchTerm, mode: "insensitive" } },
      ],
    }),
  };

  const result = await orderQueries.getAllOrders({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return {
    data: result.orders,
    page: result.page,
    limit,
    total: result.total,
    totalPages: result.totalPages,
  };
};

export const getOrderByOrderId = async (
  orderId: string,
  user: Express.User | null,
) => {
  const isUser = user?.role === "USER";

  const values = {
    id: orderId,
    ...(isUser && { userId: user.id }),
    ...(isUser && { deletedAt: null }),
  };

  const order = await orderQueries.getOrderByOrderId(values);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return order;
};

export const updateOrderStatus = async (
  orderId: string,
  data: Prisma.OrderUpdateInput,
) => {
  const existingOrder = await orderQueries.getOrderByOrderId({
    id: orderId,
  });

  if (!existingOrder) {
    throw new AppError("Order not found", 404);
  }

  const updatedOrder = await orderQueries.updateOrder(orderId, data);
  return updatedOrder;
};

export const deleteOrderUser = async (
  user: Express.User | null,
  orderId: string,
) => {
  const existingOrder = await orderQueries.getOrderByOrderId({
    id: orderId,
    userId: user?.id,
  });

  if (!existingOrder) {
    throw new AppError("Order not found", 404);
  }

  const deletedOrder = await orderQueries.updateOrder(orderId, {
    deletedAt: new Date(),
  });
  return deletedOrder;
};

export const deleteOrderAdmin = async (orderId: string) => {
  const existingOrder = await orderQueries.getOrderByOrderId({
    id: orderId,
  });

  if (!existingOrder) {
    throw new AppError("Order not found", 404);
  }

  const deletedOrder = await orderQueries.deleteOrder(orderId);
  return deletedOrder;
};
