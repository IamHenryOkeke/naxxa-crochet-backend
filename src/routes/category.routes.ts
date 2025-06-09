import { Router } from "express";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware";
import * as categoryControllers from "../controllers/category.controllers";
import { optionalAuth } from "../middlewares/optionalAuth.middleware";
import { validate } from "../middlewares/validation";
import {
  categoryParamSchema,
  createCategorySchema,
  querySchema,
  updateCategorySchema,
} from "../lib/schemas";
import { upload } from "../config/multer";
import { addFilePathToBody } from "../middlewares/addFilePathToBody.middleware";

const categoryRouter = Router();

categoryRouter.get(
  "/all",
  optionalAuth,
  validate({ query: querySchema }),
  categoryControllers.getAllCategories,
);

categoryRouter.get(
  "/:categoryId",
  optionalAuth,
  validate({ params: categoryParamSchema }),
  categoryControllers.getCategoryById,
);

// Apply authentication middleware to all other routes
categoryRouter.use(isAuthenticated, isAdmin);

categoryRouter.post(
  "/",
  upload.single("image"),
  addFilePathToBody("image"),
  validate({ body: createCategorySchema }),
  categoryControllers.createCategory,
);

categoryRouter.put(
  "/:categoryId",
  upload.single("image"),
  addFilePathToBody("image"),
  validate({ params: categoryParamSchema, body: updateCategorySchema }),
  categoryControllers.updateCategory,
);

categoryRouter.delete(
  "/:categoryId",
  validate({ params: categoryParamSchema }),
  categoryControllers.deleteCategory,
);

export default categoryRouter;
