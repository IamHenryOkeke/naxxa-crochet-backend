import { AppError } from "../error/errorHandler";
import { Prisma } from "../generated/prisma";
import prisma from "../lib/prisma";

export async function getUserByEmail(email: string) {
  try {
    const data = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error occured while finding user by email", error.message);
    } else {
      console.error("Error occured while finding user by email", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function getUserByUsername(username: string) {
  try {
    const data = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Error occured while finding user by username",
        error.message,
      );
    } else {
      console.error("Error occured while finding user by username:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function getUserById(id: string) {
  try {
    const data = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error occured while finding user by id", error.message);
    } else {
      console.error("Error occured while finding user by id", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function getUserByGoogleId(googleId: string) {
  try {
    const data = await prisma.user.findUnique({
      where: {
        googleId,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Error occured while finding user by google id",
        error.message,
      );
    } else {
      console.error("Error occured while finding user by google id", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function createUser(values: Prisma.UserCreateInput) {
  try {
    const data = await prisma.user.create({
      data: values,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating new user:", error.message);
    } else {
      console.error("Error creating new user:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function updateUser(id: string, values: Prisma.UserUpdateInput) {
  try {
    const data = await prisma.user.update({
      where: { id },
      data: values,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating user:", error.message);
    } else {
      console.error("Error updating user:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function deleteUser(id: string) {
  try {
    const data = await prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting user:", error.message);
    } else {
      console.error("Error deleting user:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}
