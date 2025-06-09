import * as categoryQueries from "../db/category.queries";
import { AppError } from "../error/errorHandler";
import { Prisma } from "../generated/prisma";

export const getAllCategories = async (
  user: Express.User | null,
  searchTerm?: string,
) => {
  const values: Prisma.CategoryWhereInput = {
    ...(!user || user.role === "USER" ? { isActive: true } : {}),
    ...(searchTerm
      ? { name: { contains: searchTerm, mode: "insensitive" } }
      : {}),
  };
  return await categoryQueries.getCategories(values);
};

export const getCategoryById = async (
  user: Express.User | null,
  categoryId: string,
) => {
  const values: Prisma.CategoryWhereInput = {
    id: categoryId,
    ...(!user || user.role === "USER" ? { isActive: true } : {}),
  };

  const category = await categoryQueries.getCategoryByCategoryId(values);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
};

export const createCategory = async (
  categoryData: Prisma.CategoryCreateInput,
) => {
  const { slug } = categoryData;

  const existingCategory =
    await categoryQueries.getCategoryByCategorySlug(slug);

  if (existingCategory) {
    throw new AppError("Category with this name already exists", 400);
  }

  const newCategory = await categoryQueries.createCategory(categoryData);
  return newCategory;
};

export const updateCategory = async (
  categoryId: string,
  categoryData: Prisma.CategoryUpdateInput,
) => {
  const existingCategory = await categoryQueries.getCategoryByCategoryId({
    id: categoryId,
  });
  if (!existingCategory) {
    throw new AppError("Category not found", 404);
  }

  const { slug } = categoryData;

  if (slug && typeof slug === "string") {
    const categoryWithSlug =
      await categoryQueries.getCategoryByCategorySlug(slug);

    if (categoryWithSlug && categoryWithSlug.id !== categoryId) {
      throw new AppError("Category with this name already exists", 400);
    }
  }

  const updatedCategory = await categoryQueries.updateCategory(
    categoryId,
    categoryData,
  );
  return updatedCategory;
};

export const deleteCategory = async (categoryId: string) => {
  const existingCategory = await categoryQueries.getCategoryByCategoryId({
    id: categoryId,
  });

  if (!existingCategory) {
    throw new AppError("Category not found", 404);
  }

  const deletedCategory = await categoryQueries.deleteCategory(categoryId);

  return deletedCategory;
};
