import {AuthenticatedRequest} from "../types/express";
import * as express from "express";

export default async (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
  const admin = (req as AuthenticatedRequest).admin
  if (!admin) {
    res.json({
      error: true,
      message: "Unauthorized",
    });
    return;
  }
  next();
};
