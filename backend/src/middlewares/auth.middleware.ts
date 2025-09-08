import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils.js";

// /src/middlewares/auth.middleware.ts

export interface AuthRequest extends Request {
  user?: any;
  fileUrl?: string; 
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
}
