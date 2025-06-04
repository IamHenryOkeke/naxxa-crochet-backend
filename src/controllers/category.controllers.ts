import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import * as categoryService from "../services/category.services";
import { generateSlug } from "../utils/slug";

export const getAllCategories = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user as Express.User;

    const categories = await categoryService.getAllCategories(user);

    res.status(201).json({
      message: "Category fetched successfully",
      categories,
    });
  },
);

export const getCategoryById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user as Express.User;
    const { categoryId } = req.params;

    const category = await categoryService.getCategoryById(user, categoryId);

    res.status(201).json({
      message: "Category fetched successfully",
      category,
    });
  },
);

export const createCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, description, image } = req.body;

    const data = {
      name,
      description,
      image,
      slug: generateSlug(name),
    };

    const newCategory = await categoryService.createCategory(data);

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  },
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { categoryId } = req.params;

    const { name, description, image, isActive } = req.body;

    const categoryData = {
      ...(name && { name, slug: generateSlug(name) }),
      ...(description && { description }),
      ...(image && { image }),
      ...(typeof isActive !== "undefined" && { isActive }),
    };

    const updatedCategory = await categoryService.updateCategory(
      categoryId,
      categoryData,
    );

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  },
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { categoryId } = req.params;

    await categoryService.deleteCategory(categoryId);

    res.status(200).json({
      message: "Category deleted successfully",
    });
  },
);
