import * as productQueries from "../db/product.queries";
import * as categoryQueries from "../db/category.queries";
import { AppError } from "../error/errorHandler";
import { Prisma, Size } from "../generated/prisma";

type GetAllProductsArgs = {
  user: Express.User | null;
  page?: number;
  limit?: number;
  searchTerm?: string;
  categoryId?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[]; // ["S", "M"]
  sortBy?: "price" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export const getAllProducts = async ({
  user,
  page = 1,
  limit = 10,
  searchTerm,
  categoryId,
  isFeatured,
  isActive,
  minPrice,
  maxPrice,
  sizes,
  sortBy,
  sortOrder,
}: GetAllProductsArgs) => {
  const where: Prisma.ProductWhereInput = {
    ...(user?.role !== "ADMIN" && { isActive: true }),
    ...(user?.role === "ADMIN" &&
      typeof isActive === "boolean" && { isActive }),
    ...(searchTerm && {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ],
    }),
    ...(categoryId && { categoryId }),
    ...(typeof isFeatured === "boolean" && { isFeatured }),
    ...(minPrice !== undefined && { price: { gte: minPrice } }),
    ...(maxPrice !== undefined && {
      price: {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        lte: maxPrice,
      },
    }),
    ...(sizes &&
      sizes.length > 0 && {
        sizes: {
          some: {
            size: { in: sizes as Size[] }, // Replace 'any' with your actual Size enum/type if available
            stock: { gt: 0 },
          },
        },
      }),
  };

  const take = limit;
  const skip = (page - 1) * take;

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" };

  return await productQueries.getProducts({
    where,
    take,
    skip,
    orderBy,
  });
};

export const getProductById = async (
  user: Express.User | null,
  productId: string,
) => {
  const values: Prisma.ProductWhereInput = {
    id: productId,
    ...(!user || user.role === "USER" ? { isActive: true } : {}),
  };

  const product = await productQueries.getProductByProductId(values);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

export const getRelatedProducts = async (productId: string) => {
  const values: Prisma.ProductWhereInput = {
    id: productId,
    isActive: true,
  };
  const product = await productQueries.getProductByProductId(values);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const where: Prisma.ProductWhereInput = {
    categoryId: product.categoryId,
    id: { not: productId },
    isActive: true,
  };

  const take = 4;
  const orderBy = { createdAt: "desc" as const };

  const relatedProducts = await productQueries.getProducts({
    where,
    take,
    orderBy,
  });

  return relatedProducts;
};

type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  images: { imageUrl: string }[];
  sizes: { size: Size; stock: number }[];
  isActive: boolean;
  isFeatured: boolean;
};

export const createProduct = async (data: CreateProductInput) => {
  const existingCategory = await categoryQueries.getCategoryByCategoryId({
    id: data.categoryId,
  });

  if (!existingCategory) {
    throw new AppError("Category doesn't exist", 400);
  }

  const newProduct = await productQueries.createProduct({
    name: data.name,
    description: data.description,
    price: data.price,
    isActive: data.isActive,
    isFeatured: data.isFeatured,
    category: {
      connect: { id: data.categoryId },
    },
    images: {
      create: data.images,
    },
    sizes: {
      create: data.sizes,
    },
  });

  return newProduct;
};

export const updateProduct = async (
  productId: string,
  data: Prisma.ProductUpdateInput,
) => {
  const existingProduct = await productQueries.getProductByProductId({
    id: productId,
  });

  if (!existingProduct) {
    throw new AppError("Product not found", 404);
  }

  const updatedProduct = await productQueries.updateProduct(productId, data);
  return updatedProduct;
};

export const deleteProduct = async (productId: string) => {
  const existingProduct = await productQueries.getProductByProductId({
    id: productId,
  });

  if (!existingProduct) {
    throw new AppError("Product not found", 404);
  }

  const deletedCategory = await productQueries.deleteProduct(productId);

  return deletedCategory;
};
