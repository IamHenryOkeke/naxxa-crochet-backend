import * as reviewQueries from "../db/review.queries";
import { AppError } from "../error/errorHandler";
import { Prisma } from "../generated/prisma";

export const getAllReviews = async (productId: string) => {
  const values: Prisma.ReviewWhereInput = { productId };
  return await reviewQueries.getReviews(values);
};

export const getReviewByReviewId = async (reviewId: string) => {
  const values: Prisma.ReviewWhereUniqueInput = { id: reviewId };
  const review = await reviewQueries.getReviewByReviewId(values);

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  return review;
};

export const createReview = async (
  user: Express.User,
  reviewData: Prisma.ReviewCreateInput,
) => {
  const { product } = reviewData;

  const existingReview = await reviewQueries.getReviewByReviewId({
    userId_productId: {
      userId: user.id,
      productId: product.connect?.id as string,
    },
  });

  if (existingReview) {
    throw new AppError("You reviewed this product already", 400);
  }

  const newReview = await reviewQueries.createReview(reviewData);
  return newReview;
};

export const updateReview = async (
  reviewId: string,
  user: Express.User,
  reviewData: Prisma.ReviewUpdateInput,
) => {
  const existingReview = await reviewQueries.getReviewByReviewId({
    id: reviewId,
  });

  if (!existingReview) {
    throw new AppError("Review not found", 404);
  }

  if (existingReview.userId !== user.id && user.role !== "ADMIN") {
    throw new AppError("You can only update your own reviews", 403);
  }

  const updatedReview = await reviewQueries.updateReview(reviewId, reviewData);
  return updatedReview;
};

export const deleteReview = async (
  reviewData: Prisma.ReviewWhereUniqueInput,
) => {
  const existingReview = await reviewQueries.getReviewByReviewId({
    id: reviewData.id,
  });

  if (!existingReview) {
    throw new AppError("Review not found", 404);
  }

  const deletedReview = await reviewQueries.deleteReview(reviewData);

  return deletedReview;
};
