import { Request, Response, NextFunction } from "express";

export const addFilePathToBody =
  (key: string) => (req: Request, res: Response, next: NextFunction) => {
    if (req.file && req.file.path) {
      req.body[key] = req.file.path;
    }
    if (!req.file) {
      delete req.body.avatar;
    }
    next();
  };
