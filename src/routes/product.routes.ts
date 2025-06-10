import { Router } from "express";
import { optionalAuth } from "../middlewares/optionalAuth.middleware";
import { validate } from "../middlewares/validation";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware";
import * as schemas from "../lib/schemas";
import * as productControllers from "../controllers/product.controllers";
import { upload } from "../config/multer";
import { addFilePathToBody } from "../middlewares/addFilePathToBody.middleware";

const productRouter = Router();

productRouter.get(
  "/all",
  optionalAuth,
  validate({ query: schemas.productQuerySchema }),
  productControllers.getAllProducts,
);

productRouter.get(
  "/:productId",
  optionalAuth,
  validate({ params: schemas.productParamSchema }),
  productControllers.getProductById,
);

productRouter.get(
  "/:productId/related",
  optionalAuth,
  validate({ params: schemas.productParamSchema }),
  productControllers.getRelatedProducts,
);

productRouter.use(isAuthenticated, isAdmin);

productRouter.post(
  "/",
  upload.array("images", 3),
  addFilePathToBody("images"),
  validate({ body: schemas.addProductSchema }),
  productControllers.createProduct,
);

productRouter.put(
  "/:productId",
  upload.array("images", 3),
  addFilePathToBody("images"),
  validate({
    body: schemas.updateProductSchema,
    params: schemas.productParamSchema,
  }),
  productControllers.updateProduct,
);

productRouter.delete(
  "/:productId",
  validate({ params: schemas.productParamSchema }),
  productControllers.deleteProduct,
);

export default productRouter;
