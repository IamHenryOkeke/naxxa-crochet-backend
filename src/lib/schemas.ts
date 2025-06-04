import { z } from "zod";

export const createUserSchema = z.object({
  username: z
    .string({ message: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters long" }),
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Email must be valid" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});

export const loginUserSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Email must be valid" }),
  password: z.string({ message: "Password is required" }).min(6),
});

export const sendVerificationLinkSchema = loginUserSchema.pick({
  email: true,
});

export const verifyAccountQuerySchema = z.object({
  token: z
    .string()
    .min(3, { message: "Token must be at least 3 characters long" }),
});

export const resetPassswordSchema = createUserSchema
  .omit({ username: true, email: true })
  .merge(verifyAccountQuerySchema);

export const updateUserProfileSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .optional(),
  avatar: z.string().url({ message: "Avatar must be a valid url" }).optional(),
});

export const createCategorySchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters long" }),
  description: z
    .string({ message: "Description is required" })
    .min(3, { message: "Description must be at least 3 characters long" }),
  image: z
    .string({ message: "Image url is required" })
    .url({ message: "Image must be a valid URL" }),
});

export const updateCategorySchema = createCategorySchema.partial().merge(
  z.object({
    isActive: z.boolean().optional(),
  }),
);

export const categoryParamSchema = z.object({
  categoryId: z.string().cuid(),
});

export const querySchema = z.object({
  page: z.string().optional(),
  searchTerm: z
    .string()
    .min(1, { message: "Search term must be at least 1 characters long" })
    .default("")
    .optional(),
  limit: z.string().optional(),
});
