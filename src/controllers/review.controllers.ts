import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import * as reviewService from "../services/review.services";
import { Prisma } from "../generated/prisma";

export const getAllReviews = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { productId } = req.params;
    const reviews = await reviewService.getAllReviews(productId);

    res.status(200).json({
      message: "Reviews fetched successfully",
      reviews,
    });
  },
);

export const getReviewById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { reviewId } = req.params;

    const reviews = await reviewService.getReviewByReviewId(reviewId);

    res.status(200).json({
      message: "Review fetched successfully",
      reviews,
    });
  },
);

export const createReview = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user as Express.User;
    const { rating, comment, productId } = req.body;

    const reviewData: Prisma.ReviewCreateInput = {
      rating,
      comment,
      product: {
        connect: {
          id: productId,
        },
      },
      user: {
        connect: {
          id: user.id,
        },
      },
    };

    const reviews = await reviewService.createReview(user, reviewData);

    res.status(201).json({
      message: "Reviews fetched successfully",
      reviews,
    });
  },
);

export const updateReview = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user as Express.User;

    const { reviewId } = req.params;

    const { rating, comment } = req.body;

    const reviewData: Prisma.ReviewUpdateInput = {
      rating,
      comment,
    };

    const reviews = await reviewService.updateReview(
      reviewId,
      user,
      reviewData,
    );

    res.status(200).json({
      message: "Review updated successfully",
      reviews,
    });
  },
);

export const deleteReview = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { reviewId } = req.params;
    const user = req.user as Express.User;

    await reviewService.deleteReview({ id: reviewId, userId: user.id });

    res.status(204).json({
      message: "Review deleted successfully",
    });
  },
);
