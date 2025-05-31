import { Router } from "express";
import {
  createUserSchema,
  loginUserSchema,
  resetPassswordSchema,
  sendVerificationLinkSchema,
  verifyAccountQuerySchema,
} from "../lib/schemas";
import passport from "passport";
import { signJWT } from "../utils/jwt";
import { validate } from "../middlewares/validation";
import { User } from "../generated/prisma";
import {
  authSignUp,
  authLogin,
  authSendVerificationEmail,
  authVerifyEmail,
  authSendResetPasswordEmail,
  authResetPassword,
} from "../controllers/auth.controllers";

const authRouter = Router();

authRouter.post("/sign-up", validate({ body: createUserSchema }), authSignUp);
authRouter.get(
  "/verify-account",
  validate({ query: verifyAccountQuerySchema }),
  authVerifyEmail,
);
authRouter.post(
  "/request-verification-link",
  validate({ body: sendVerificationLinkSchema }),
  authSendVerificationEmail,
);

authRouter.post("/login", validate({ body: loginUserSchema }), authLogin);
authRouter.post(
  "/request-password-reset",
  validate({ body: sendVerificationLinkSchema }),
  authSendResetPasswordEmail,
);
authRouter.post(
  "/reset-password",
  validate({ body: resetPassswordSchema }),
  authResetPassword,
);

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user as User;

    const token = signJWT(
      user,
      60 * 30, // 30 minutes expiration
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  },
);

export default authRouter;
