import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import * as userService from "../services/user.services";

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user as { id: string };

    const currentUser = await userService.getCurrentUser(user.id);

    res.status(201).json({
      message: "User fetched successfully",
      currentUser,
    });
  },
);

export const updateCurrentUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user as { id: string };

    const updatedUser = await userService.updateCurrentUser(user.id, req.body);

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  },
);

export const deleteCurrentUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user as { id: string };

    const deletedUser = await userService.deleteCurrentUser(user.id);

    res.status(200).json({
      message: "User deleted successfully",
      data: deletedUser,
    });
  },
);
