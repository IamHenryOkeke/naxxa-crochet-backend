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
    .any()
    .transform((val) => {
      // multer will set req.body.image to string path
      return typeof val === "string" ? val : "";
    })
    .refine((val) => val.trim().length > 0, {
      message: "Image is required",
    }),
});

export const updateCategorySchema = createCategorySchema.partial().merge(
  z.object({
    isActive: z
      .enum(["true", "false"])
      .transform((val) => val === "true")
      .optional(),
  }),
);

export const categoryParamSchema = z.object({
  categoryId: z.string().cuid(),
});

export const productParamSchema = z.object({
  productId: z.string().cuid(),
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

export const productQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, { message: "Page must be a positive integer" })
    .transform(Number)
    .default("1")
    .optional(),

  limit: z
    .string()
    .regex(/^\d+$/, { message: "Limit must be a positive integer" })
    .transform(Number)
    .default("10")
    .optional(),

  searchTerm: z.string().optional(),

  categoryId: z.string().uuid().optional(),

  isFeatured: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),

  isActive: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),

  minPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: "Min price must be a valid number" })
    .transform(Number)
    .optional(),

  maxPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: "Max price must be a valid number" })
    .transform(Number)
    .optional(),

  sizes: z
    .string()
    .optional() // e.g., "S,M,L"
    .transform((val) => (val ? val.split(",") : undefined)),

  sortBy: z.enum(["price", "createdAt"]).optional(),

  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const addProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),

  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format")
    .transform(Number),

  categoryId: z.string().cuid(),

  isActive: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .default("true"),

  isFeatured: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .default("false"),

  sizes: z
    .string()
    .transform((val) => {
      try {
        return JSON.parse(val);
      } catch {
        return [];
      }
    })
    .refine((val) => Array.isArray(val) && val.length > 0, {
      message: "Sizes must be a non-empty array",
    })
    .refine(
      (val) =>
        val.every(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (item: any) =>
            typeof item.size === "string" &&
            ["XS", "S", "M", "L", "XL", "XXL"].includes(item.size) &&
            typeof item.stock === "number",
        ),
      { message: "Each size must include a valid size and stock number" },
    ),

  images: z
    .any()
    .transform((val) => {
      // From middleware: req.body.images = string[] of paths
      if (typeof val === "string") return [val];
      if (Array.isArray(val)) return val;
      return [];
    })
    .refine((val) => Array.isArray(val) && val.length > 0, {
      message: "At least one image is required",
    })
    .refine((val) => val.every((path) => typeof path === "string"), {
      message: "All images must be valid strings",
    }),
});

export const updateProductSchema = addProductSchema.partial();
