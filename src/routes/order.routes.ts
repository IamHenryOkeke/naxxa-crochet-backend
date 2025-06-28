import { Router } from "express";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware";
import { optionalAuth } from "../middlewares/optionalAuth.middleware";
import { validate } from "../middlewares/validation";
import * as schemas from "../lib/schemas";
import * as orderControllers from "../controllers/order.controllers";

const orderRouter = Router();

orderRouter.post(
  "/",
  optionalAuth,
  validate({ body: schemas.createOrderSchema }),
  orderControllers.createOrder,
);

orderRouter.use(isAuthenticated);

orderRouter.get(
  "/all",
  validate({ query: schemas.getAllOrdersQuerySchema }),
  orderControllers.getAllOrders,
);

orderRouter.get(
  "/:orderId",
  validate({ params: schemas.orderIdParamSchema }),
  orderControllers.getOrderById,
);

orderRouter.delete(
  "/:orderId",
  validate({ params: schemas.orderIdParamSchema }),
  orderControllers.deleteOrderUser,
);

orderRouter.use(isAdmin);

orderRouter.get(
  "/admin/all",
  validate({ query: schemas.getAllOrdersQuerySchema }),
  orderControllers.getAllOrders,
);

orderRouter.get(
  "/admin/:orderId",
  validate({ params: schemas.orderIdParamSchema }),
  orderControllers.getOrderById,
);

orderRouter.put(
  "/admin/:orderId/status",
  validate({
    body: schemas.updateOrderStatusSchema,
    params: schemas.orderIdParamSchema,
  }),
  orderControllers.updateOrderStatus,
);

orderRouter.delete(
  "/admin/:orderId",
  validate({ params: schemas.orderIdParamSchema }),
  orderControllers.deleteOrderAdmin,
);

export default orderRouter;
