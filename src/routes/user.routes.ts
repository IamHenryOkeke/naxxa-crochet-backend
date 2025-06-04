import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation";
import { upload } from "../config/multer";
import { addFilePathToBody } from "../middlewares/addFilePathToBody.middleware";
import { updateUserProfileSchema } from "../lib/schemas";
import {
  deleteCurrentUser,
  getCurrentUser,
  updateCurrentUser,
} from "../controllers/user.controllers";

const userRouter = Router();

userRouter.use(isAuthenticated);

userRouter.get("/profile", getCurrentUser);
userRouter.put(
  "/profile",
  upload.single("avatar"),
  addFilePathToBody("avatar"),
  validate({ body: updateUserProfileSchema }),
  updateCurrentUser,
);
userRouter.delete("/profile", deleteCurrentUser);

export default userRouter;
