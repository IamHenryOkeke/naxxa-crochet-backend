import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import * as productService from "../services/product.services";
import { AppError } from "../error/errorHandler";

export const getAllProducts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user as Express.User;

    const products = await productService.getAllProducts({
      user,
      ...req.validatedQuery,
    });

    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  },
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user as Express.User;
    const { productId } = req.params;

    const product = await productService.getProductById(user, productId);

    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  },
);

export const getRelatedProducts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { productId } = req.params;

    const relatedProducts = await productService.getRelatedProducts(productId);

    res.status(200).json({
      message: "Related Products fetched successfully",
      relatedProducts,
    });
  },
);

export const createProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const {
      name,
      description,
      price,
      categoryId,
      images,
      sizes,
      isActive,
      isFeatured,
    } = req.body;

    const newProduct = await productService.createProduct({
      name,
      description,
      price,
      categoryId,
      images: images.map((url: string) => ({ imageUrl: url })),
      sizes,
      isActive,
      isFeatured,
    });

    if (!newProduct) {
      throw new AppError("Failed to create product", 400);
    }

    res.status(201).json({
      message: "Product created successfully",
      category: newProduct,
    });
  },
);

export const updateProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { productId } = req.params;
    const {
      name,
      description,
      price,
      categoryId,
      images,
      sizes,
      isActive,
      isFeatured,
    } = req.body;

    const updatedProduct = await productService.updateProduct(productId, {
      ...(name && { name }),
      ...(description && { description }),
      ...(price && { price }),
      ...(categoryId && { categoryId }),
      ...(typeof isActive === "boolean" && { isActive }),
      ...(typeof isFeatured === "boolean" && { isFeatured }),
      ...(images && {
        images: {
          deleteMany: {}, // delete existing images
          create: images.map((url: string) => ({ imageUrl: url })),
        },
      }),
      ...(sizes && {
        sizes: {
          deleteMany: {}, // delete existing sizes
          create: sizes, // array of { size, stock }
        },
      }),
    });

    if (!updatedProduct) {
      throw new AppError("Product not found or failed to update", 404);
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  },
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { productId } = req.params;

    await productService.deleteProduct(productId);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  },
);
