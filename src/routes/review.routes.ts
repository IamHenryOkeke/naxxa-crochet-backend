import { isAuthenticated } from "../middlewares/auth.middleware";
import { Router } from "express";
import * as reviewControllers from "../controllers/review.controllers";
import { validate } from "../middlewares/validation";
import * as schemas from "../lib/schemas";

const reviewRouter = Router();

reviewRouter.get(
  "/product/:productId",
  validate({ params: schemas.productParamSchema }),
  reviewControllers.getAllReviews,
);

// Public: Get a single review
reviewRouter.get(
  "/:reviewId",
  validate({ params: schemas.reviewParamSchema }),
  reviewControllers.getReviewById,
);

reviewRouter.use(isAuthenticated);

reviewRouter.post(
  "/",
  validate({ body: schemas.createReviewSchema }),
  reviewControllers.createReview,
);

// Protected: Update a review
reviewRouter.put(
  "/:reviewId",
  validate({
    params: schemas.reviewParamSchema,
    body: schemas.updateReviewSchema,
  }),
  reviewControllers.updateReview,
);

// Protected: Delete a review
reviewRouter.delete(
  "/:reviewId",
  validate({ params: schemas.reviewParamSchema }),
  reviewControllers.deleteReview,
);

export default reviewRouter;
