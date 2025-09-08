
// /src/validators/cart.validators.ts
import { z } from "zod";

export const addToCartSchema = z.object({
  itemId: z.uuid("Invalid item ID"),
  quantity: z
    .preprocess(
      (val) => (typeof val === "string" ? parseInt(val) : val),
      z.number().int().min(1).default(1)
    ),
});

export const updateCartItemSchema = z.object({
  quantity: z
    .preprocess(
      (val) => (typeof val === "string" ? parseInt(val) : val),
      z.number().int().min(0)
    ),
});
