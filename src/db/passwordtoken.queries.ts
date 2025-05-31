import { AppError } from "../error/errorHandler";
import { Prisma } from "../generated/prisma";
import prisma from "../lib/prisma";

export async function createPasswordResetToken(
  values: Prisma.PasswordResetTokenCreateInput,
) {
  try {
    const data = await prisma.passwordResetToken.create({
      data: values,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating token:", error.message);
    } else {
      console.error("Error creating token:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function getPasswordResetTokenByHashedToken(tokenHash: string) {
  try {
    const data = await prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error getting token:", error.message);
    } else {
      console.error("Error getting token:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}

export async function deletePasswordResetToken(userId: string) {
  try {
    const data = await prisma.passwordResetToken.deleteMany({
      where: {
        userId,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating token:", error.message);
    } else {
      console.error("Error creating token:", error);
    }
    throw new AppError("Internal server error", 500);
  }
}
