import { AppError } from "../error/errorHandler";
import { Prisma } from "../generated/prisma";
import prisma from "../lib/prisma";

type GetProductsArgs = {
  where?: Prisma.ProductWhereInput;
  take?: number;
  skip?: number;
  orderBy?: Prisma.ProductOrderByWithRelationInput;
};

export async function getProducts({
  where,
  take,
  skip,
  orderBy,
}: GetProductsArgs) {
  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take,
        skip,
        orderBy,
        include: {
          images: {
            select: {
              imageUrl: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      total,
      totalPage: take ? Math.ceil(total / take) : 1,
      page: skip && take ? Math.ceil(skip / take) + 1 : 1,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error occurred while finding products:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function getProductByProductId(values: Prisma.ProductWhereInput) {
  try {
    const data = await prisma.product.findFirst({
      where: values,
      include: {
        images: {
          select: {
            imageUrl: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        sizes: {
          select: {
            size: true,
            stock: true,
          },
        },
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error occured while finding product by id", error.message);
    } else {
      console.error("Error occured while finding product by id", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function createProduct(values: Prisma.ProductCreateInput) {
  try {
    const data = await prisma.product.create({
      data: values,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        isActive: true,
        isFeatured: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating new product:", error.message);
    } else {
      console.error("Error creating new product:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function updateProduct(
  id: string,
  values: Prisma.ProductUpdateInput,
) {
  try {
    const data = await prisma.product.update({
      where: { id },
      data: values,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating product:", error.message);
    } else {
      console.error("Error updating product:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function deleteProduct(id: string) {
  try {
    const data = await prisma.product.delete({
      where: { id },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting product:", error.message);
    } else {
      console.error("Error deleting product:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}
