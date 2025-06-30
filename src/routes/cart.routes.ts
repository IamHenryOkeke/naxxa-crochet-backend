import { isAuthenticated } from "../middlewares/auth.middleware";
import { Router } from "express";
import { validate } from "../middlewares/validation";
import * as schemas from "../lib/schemas";
import * as cartController from "../controllers/cart.controllers";

const cartRouter = Router();

cartRouter.use(isAuthenticated);

cartRouter.get("/", cartController.getCart);

cartRouter.post(
  "/",
  validate({ body: schemas.addCartItemSchema }),
  cartController.addItemToCart,
);

cartRouter.put(
  "/:cartItemId",
  validate({
    params: schemas.cartParamSchema,
    body: schemas.updateCartItemSchema,
  }),
  cartController.updateCartItem,
);

cartRouter.delete(
  "/:cartItemId",
  validate({ params: schemas.cartParamSchema }),
  cartController.deleteCartItem,
);

export default cartRouter;
