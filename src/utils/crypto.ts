import crypto from "crypto";

export const createResetToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hashedToken };
};

export const hashResetToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
