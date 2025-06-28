import { AppError } from "../error/errorHandler";
import { Prisma } from "../generated/prisma";
import prisma from "../lib/prisma";

export async function getAllOrders({
  where,
  take,
  skip,
  orderBy,
}: {
  where: Prisma.OrderWhereInput;
  take: number;
  skip: number;
  orderBy: Prisma.OrderOrderByWithRelationInput;
}) {
  try {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        take,
        skip,
        orderBy,
        select: {
          id: true,
          userFirstName: true,
          userLastName: true,
          userEmail: true,
          userPhone: true,
          total: true,
          paymentStatus: true,
          deliveryStatus: true,
          createdAt: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      total,
      totalPages: take ? Math.ceil(total / take) : 1,
      page: skip && take ? Math.ceil(skip / take) + 1 : 1,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error occurred while retrieving orders:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function getOrderByOrderId(values: Prisma.OrderWhereUniqueInput) {
  try {
    const data = await prisma.order.findUnique({
      where: values,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error finding order:", error.message);
    } else {
      console.error("Error finding order:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function createOrder(
  tx: Prisma.TransactionClient,
  values: Prisma.OrderCreateInput,
) {
  try {
    const data = await tx.order.create({
      data: values,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating new order:", error.message);
    } else {
      console.error("Error creating new order:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function updateOrder(id: string, values: Prisma.OrderUpdateInput) {
  try {
    const data = await prisma.order.update({
      where: { id },
      data: values,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error updating order ${id}:`, error.message);
    } else {
      console.error(`Error updating order ${id}:`, error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function deleteOrder(id: string) {
  try {
    const data = await prisma.order.delete({
      where: { id },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting order:", error.message);
    } else {
      console.error("Error deleting order:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}
