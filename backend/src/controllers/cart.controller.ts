import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { prisma } from "../db/db.js";
import { HttpError } from "../utils/http-error.util.js";
import z from "zod";
import {
  addToCartSchema,
  updateCartItemSchema,
} from "../validators/cart.validators.js";

// /src/controllers/cart.controller.ts

// Get user's cart
export async function getCart(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { item: true } } },
    });

    if (!cart) {
      // create empty cart if not exists
      cart = await prisma.cart.create({
        data: { userId: req.user.id },
        include: { items: { include: { item: true } } },
      });
    }

    return res.json(cart);
  } catch (err) {
    next(err);
  }
}

// Add item to cart
export async function addToCart(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const result = addToCartSchema.safeParse(req.body);
  if (!result.success) {
    throw new HttpError(400, "Validation failed", z.treeifyError(result.error));
  }

  const { itemId, quantity = 1 } = result.data;

  try {
    // Ensure user has a cart
    let cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: req.user.id } });
    }

    // Check if item already exists in cart
    const existing = await prisma.cartItem.findUnique({
      where: { cartId_itemId: { cartId: cart.id, itemId } },
    });

    let updatedItem;
    if (existing) {
      updatedItem = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      updatedItem = await prisma.cartItem.create({
        data: { cartId: cart.id, itemId, quantity },
      });
    }

    return res.json(updatedItem);
  } catch (err) {
    next(err);
  }
}

// Update quantity
export async function updateCartItem(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const result = updateCartItemSchema.safeParse(req.body);
  if (!result.success) {
    throw new HttpError(400, "Validation failed", z.treeifyError(result.error));
  }

  const { id } = req.params; // cartItemId
  if (!id) {
    throw new HttpError(400, "Cart item ID is required");
  }
  const { quantity } = result.data;

  try {
    const existing = await prisma.cartItem.findUnique({
      where: { id },
      include: { cart: true },
    });

    if (!existing || existing.cart.userId !== req.user.id) {
      throw new HttpError(403, "You do not own this cart item");
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id } });
      return res.json({ message: "Item removed" });
    }

    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });

    return res.json(updated);
  } catch (err) {
    next(err);
  }
}

// Remove item
export async function removeFromCart(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params; // cartItemId
  if (!id) {
    throw new HttpError(400, "Cart item ID is required");
  }
  try {
    const existing = await prisma.cartItem.findUnique({
      where: { id },
      include: { cart: true },
    });

    if (!existing || existing.cart.userId !== req.user.id) {
      throw new HttpError(403, "You do not own this cart item");
    }

    await prisma.cartItem.delete({ where: { id } });
    return res.json({ message: "Item removed" });
  } catch (err) {
    next(err);
  }
}
