import { AppError } from "../error/errorHandler";
import { Prisma } from "../generated/prisma";
import prisma from "../lib/prisma";

export async function getCategories(values: Prisma.CategoryWhereInput) {
  try {
    const data = await prisma.category.findMany({
      where: values,
      orderBy: { createdAt: "desc" },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error occurred while finding categories:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function getCategoryByCategoryId(
  values: Prisma.CategoryWhereInput,
) {
  try {
    const data = await prisma.category.findFirst({
      where: values,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Error occured while finding category by id",
        error.message,
      );
    } else {
      console.error("Error occured while finding category by id", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function getCategoryByCategorySlug(slug: string) {
  try {
    const data = await prisma.category.findUnique({
      where: {
        slug,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Error occured while finding category by slug",
        error.message,
      );
    } else {
      console.error("Error occured while finding category by slug", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function createCategory(values: Prisma.CategoryCreateInput) {
  try {
    const data = await prisma.category.create({
      data: values,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating new category:", error.message);
    } else {
      console.error("Error creating new category:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function updateCategory(
  id: string,
  values: Prisma.CategoryUpdateInput,
) {
  try {
    const data = await prisma.category.update({
      where: { id },
      data: values,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating category:", error.message);
    } else {
      console.error("Error updating category:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function deleteCategory(id: string) {
  try {
    const data = await prisma.category.delete({
      where: { id },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting category:", error.message);
    } else {
      console.error("Error deleting category:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}
