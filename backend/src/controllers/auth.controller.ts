import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt.utils.js";
import { prisma } from "../db/db.js";
import { HttpError } from "../utils/http-error.util.js";
import { loginSchema, signupSchema } from "../validators/auth.validators.js";
import z from "zod";

// /src/controllers/auth.controller.ts

export async function signup(req: Request, res: Response, next: NextFunction) {
  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    throw new HttpError(400, "Validation failed", z.treeifyError(result.error));
  }
  
  const { email, password } = result.data;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new HttpError(400, "Email already registered");
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed },
    });

    await prisma.cart.create({ data: { userId: user.id } });

    const token = signToken({ id: user.id, email: user.email });

    return res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    throw new HttpError(400, "Validation failed", z.treeifyError(result.error));
  }

  const { email, password } = result.data;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new HttpError(401, "Invalid credentials");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new HttpError(401, "Invalid credentials");
    }

    const token = signToken({ id: user.id, email: user.email });

    return res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    next(err);
  }
}
