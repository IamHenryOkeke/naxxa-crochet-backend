import { Request, Response, NextFunction } from "express";
import { AppError } from "../error/errorHandler";

export const addFilePathToBody =
  (key: string) => (req: Request, res: Response, next: NextFunction) => {
    if (req.file?.path) {
      req.body[key] = req.file.path;
    } else {
      delete req.body[key];
    }

    if (typeof req.body.isActive === "string") {
      const isActiveStr = req.body.isActive.toLowerCase();
      if (isActiveStr === "true") {
        req.body.isActive = true;
      } else if (isActiveStr === "false") {
        req.body.isActive = false;
      } else {
        throw new AppError(
          'Invalid isActive format. Must be "true" or "false"',
          400,
        );
      }
    }

    next();
  };
