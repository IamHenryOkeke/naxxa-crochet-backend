import {
  getCategories,
  getCategoryByCategoryId,
  getCategoryByCategorySlug,
  createCategory as createCategoryQuery,
  updateCategory as updateCategoryQuery,
  deleteCategory as deleteCategoryQuery,
} from "../db/category.queries";
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
  return await getCategories(values);
};

export const getCategoryById = async (
  user: Express.User | null,
  categoryId: string,
) => {
  const values: Prisma.CategoryWhereInput = {
    id: categoryId,
    ...(!user || user.role === "USER" ? { isActive: true } : {}),
  };

  const category = await getCategoryByCategoryId(values);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
};

export const createCategory = async (
  categoryData: Prisma.CategoryCreateInput,
) => {
  const { slug } = categoryData;

  const existingCategory = await getCategoryByCategorySlug(slug);

  if (existingCategory) {
    throw new AppError("Category with this name already exists", 400);
  }

  const newCategory = await createCategoryQuery(categoryData);
  return newCategory;
};

export const updateCategory = async (
  categoryId: string,
  categoryData: Prisma.CategoryUpdateInput,
) => {
  const existingCategory = await getCategoryByCategoryId({ id: categoryId });
  if (!existingCategory) {
    throw new AppError("Category not found", 404);
  }

  const { slug } = categoryData;

  if (slug && typeof slug === "string") {
    const categoryWithSlug = await getCategoryByCategorySlug(slug);

    if (categoryWithSlug && categoryWithSlug.id !== categoryId) {
      throw new AppError("Category with this name already exists", 400);
    }
  }

  const updatedCategory = await updateCategoryQuery(categoryId, categoryData);
  return updatedCategory;
};

export const deleteCategory = async (categoryId: string) => {
  const existingCategory = await getCategoryByCategoryId({ id: categoryId });

  if (!existingCategory) {
    throw new AppError("Category not found", 404);
  }

  const deletedCategory = await deleteCategoryQuery(categoryId);

  return deletedCategory;
};
