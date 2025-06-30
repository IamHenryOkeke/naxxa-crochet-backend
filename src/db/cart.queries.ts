import { AppError } from "../error/errorHandler";
import { Prisma } from "../generated/prisma";
import prisma from "../lib/prisma";

export async function getCart(values: Prisma.CartWhereUniqueInput) {
  try {
    const data = await prisma.cart.findUnique({
      where: values,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error occurred while finding user cart:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function createCart(values: Prisma.CartCreateInput) {
  try {
    const data = await prisma.cart.create({
      data: values,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating new cart:", error.message);
    } else {
      console.error("Error creating new cart:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

// find cart item by unique identifier

export async function getCartItem(where: Prisma.CartItemWhereInput) {
  try {
    const data = await prisma.cartItem.findFirst({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error finding cart item:", error.message);
    } else {
      console.error("Error finding cart item:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function addCartItem(values: Prisma.CartItemCreateInput) {
  try {
    const data = await prisma.cartItem.create({
      data: values,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error adding item to cart:", error.message);
    } else {
      console.error("Error adding item to cart:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function updateCartItem(
  values: Prisma.CartItemUpdateInput,
  where: Prisma.CartItemWhereUniqueInput,
) {
  try {
    const data = await prisma.cartItem.update({
      where,
      data: values,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating cart item:", error.message);
    } else {
      console.error("Error updating cart item:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function deleteCartItem(where: Prisma.CartItemWhereUniqueInput) {
  try {
    const data = await prisma.cartItem.delete({
      where,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting cart item:", error.message);
    } else {
      console.error("Error deleting cart item:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}
