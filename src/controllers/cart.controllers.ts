import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import * as cartService from "../services/cart.services";

export const getCart = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user as Express.User;
    const cart = await cartService.getCart(user.id);

    res.status(200).json({
      message: "Cart fetched successfully",
      cart: cart ?? { items: [] },
    });
  },
);

export const addItemToCart = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user as Express.User;
    const { productId, quantity, size } = req.body;

    const cartData = {
      productId,
      quantity,
      size,
    };

    const item = await cartService.addToCart(user.id, cartData);

    res.status(201).json({
      message: "Item added successfully",
      item,
    });
  },
);

export const updateCartItem = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user as Express.User;
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    const updatedItem = await cartService.updateCartItem(user.id, cartItemId, {
      quantity,
    });

    res.status(200).json({
      message: "Item updated successfully",
      item: updatedItem,
    });
  },
);

export const deleteCartItem = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user as Express.User;
    const { cartItemId } = req.params;

    await cartService.deleteCartItem(user.id, cartItemId);

    res.status(200).json({
      message: "Item deleted successfully",
    });
  },
);
