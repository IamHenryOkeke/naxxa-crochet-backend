import * as cartQueries from "../db/cart.queries";
import { AppError } from "../error/errorHandler";
import { Prisma, Size } from "../generated/prisma";

export const getCart = async (userId: string) => {
  const values: Prisma.CartWhereUniqueInput = { userId };
  const data = await cartQueries.getCart(values);
  return data;
};

export const addToCart = async (
  userId: string,
  data: {
    productId: string;
    quantity: number;
    size: Size;
  },
) => {
  const values = { userId };

  let cart;
  cart = await cartQueries.getCart(values);
  if (!cart) {
    cart = await cartQueries.createCart({ user: { connect: { id: userId } } });
  }

  const existingItem = await cartQueries.getCartItem({
    cartId: cart.id,
    size: data.size as Size,
    productId: data.productId,
  });

  if (existingItem) {
    const updatedItem = await cartQueries.updateCartItem(
      {
        quantity: existingItem.quantity + (data.quantity as number),
        size: data.size as Size,
      },
      { id: existingItem.id },
    );
    return updatedItem;
  } else {
    const newItem = await cartQueries.addCartItem({
      cart: { connect: { id: cart.id } },
      product: { connect: { id: data.productId } },
      quantity: data.quantity as number,
      size: data.size as Size,
    });
    return newItem;
  }
};

export const updateCartItem = async (
  userId: string,
  cartItemId: string,
  data: {
    quantity: number;
  },
) => {
  const cart = await cartQueries.getCart({ userId });

  if (!cart) {
    throw new AppError("User cart not found", 404);
  }

  const existingItem = await cartQueries.getCartItem({
    cartId: cart.id,
    id: cartItemId,
  });

  if (!existingItem) {
    throw new AppError("Cart item not found", 404);
  }

  const updatedItem = await cartQueries.updateCartItem(
    {
      quantity: existingItem.quantity + (data.quantity as number),
    },
    { id: existingItem.id },
  );
  return updatedItem;
};

export const deleteCartItem = async (userId: string, cartItemId: string) => {
  const cart = await cartQueries.getCart({ userId });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const existingItem = await cartQueries.getCartItem({
    cartId: cart.id,
    id: cartItemId,
  });

  if (!existingItem) {
    throw new AppError("Cart item not found", 404);
  }

  const updatedItem = await cartQueries.deleteCartItem({ id: existingItem.id });
  return updatedItem;
};
