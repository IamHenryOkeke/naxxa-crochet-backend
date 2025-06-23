import { AppError } from "../error/errorHandler";
import { Prisma } from "../generated/prisma";
import prisma from "../lib/prisma";

export async function getReviews(values: Prisma.ReviewWhereInput) {
  try {
    const data = await prisma.review.findMany({
      where: values,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error occurred while finding reviews:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function getReviewByReviewId(
  values: Prisma.ReviewWhereUniqueInput,
) {
  try {
    const data = await prisma.review.findUnique({
      where: values,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error occured while finding review by id", error.message);
    } else {
      console.error("Error occured while finding review by id", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function createReview(values: Prisma.ReviewCreateInput) {
  try {
    const data = await prisma.review.create({
      data: values,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating new review:", error.message);
    } else {
      console.error("Error creating new review:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function updateReview(
  id: string,
  values: Prisma.ReviewUpdateInput,
) {
  try {
    const data = await prisma.review.update({
      where: { id },
      data: values,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating review:", error.message);
    } else {
      console.error("Error updating review:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function deleteReview(values: Prisma.ReviewWhereUniqueInput) {
  try {
    const data = await prisma.review.delete({
      where: values,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting review:", error.message);
    } else {
      console.error("Error deleting review:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}
