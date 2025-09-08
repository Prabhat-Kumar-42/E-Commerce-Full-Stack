import { z } from "zod";

// /src/validators/item.validators.ts
export const itemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  price: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().positive("Price must be a positive number")
  ),
  category: z.string().min(1, "Category is required"),
  imageFile: z.any().optional(), // handled by multer
});
