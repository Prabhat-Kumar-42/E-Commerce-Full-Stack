import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { itemSchema } from "../validators/item.validators.js";
import path from "path";
import z from "zod";
import { prisma } from "../db/db.js";
import { deleteOldImage } from "../utils/helpers.util.js";
import { HttpError } from "../utils/http-error.util.js";

// /src/controllers/items.controller.ts

// Get all unique categories
export async function getCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await prisma.item.findMany({
      distinct: ["category"],
      select: { category: true },
    });
    res.json(categories.map((c: { category: string; }) => c.category));
  } catch (err) {
    next(err);
  }
}


// Get all items with filters
export async function getItems(req: Request, res: Response, next: NextFunction) {
  const { q, category, min, max, page = "1", limit = "10" } = req.query;

  const filters: any = {};
  if (category) filters.category = String(category);
  if (min || max) {
    filters.price = {};
    if (min) filters.price.gte = parseFloat(String(min));
    if (max) filters.price.lte = parseFloat(String(max));
  }

  try {
    const items = await prisma.item.findMany({
      where: {
        ...filters,
        title: q ? { contains: String(q), mode: "insensitive" } : undefined,
      },
      skip: (parseInt(String(page)) - 1) * parseInt(String(limit)),
      take: parseInt(String(limit)),
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.item.count({ where: filters });

    return res.json({ items, total });
  } catch (err) {
    next(err);
  }
}

export async function getItemById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  if(!id) {
    throw new HttpError(400, "Item ID is required");
  }
  try {
    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) throw new HttpError(404, "Item not found")
    return res.json(item);
  } catch (err) {
    next(err);
  }
}

// Create item
export async function createItem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = itemSchema.safeParse({
      ...req.body,
      imageFile: req.file,
    });

    if (!result.success) {
       throw new HttpError(400, "Validation failed", z.treeifyError(result.error));
    }

    const { title, description, price, category, imageFile } = result.data;

    let imageUrl = null;
    if (imageFile ) {
      imageUrl = req.fileUrl as string;
    }

    const item = await prisma.item.create({
      data: {
        title,
        description: description || null,
        price,
        category,
        imageUrl,
        user: { connect: { id: req.user.id } },
      },
    });

    return res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

// Update item
export async function updateItem(req: AuthRequest, res: Response, next: NextFunction) {
  const { id } = req.params;
  if(!id) {
    throw new HttpError(400, "Item ID is required");
  }
  try {
    const item = await prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      throw new HttpError(404, "Item not found");
    }

    if (item.userId !== req.user.id) {
      throw new HttpError(403, "You can only update your own items");
    }

    const result = itemSchema.safeParse({
      ...req.body,
      imageFile: req.file,
    });

    if (!result.success) {
      throw new HttpError(400, "Validation failed", z.treeifyError(result.error));
    }

    const { title, description, price, category, imageFile } = result.data;

    let imageUrl = item.imageUrl;
    if (imageFile) {
      imageUrl = req.fileUrl as string;
      if(item.imageUrl) {
      const oldImagePath = path.join(
        process.cwd(),
        item.imageUrl.startsWith("/") ? item.imageUrl.slice(1) : item.imageUrl
      );
      await deleteOldImage(oldImagePath);
    }
    }

    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        title: title || item.title,
        description: description || item.description,
        price: price ? parseFloat(String(price)) : item.price,
        category: category || item.category,
        imageUrl,
      },
    });

    return res.json(updatedItem);
  } catch (err) {
    next(err);
  }
}

export async function deleteItem(req: AuthRequest, res: Response, next: NextFunction) {
  const { id } = req.params;
  if(!id) {
    throw new HttpError(400, "Item ID is required");
  }
  try {
    const item = await prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      throw new HttpError(404, "Item not found");
    }

    if (item.userId !== req.user.id) {
      throw new HttpError(403, "You can only delete your own items");
    }

    await prisma.item.delete({ where: { id } });
    return res.json({ message: "Item deleted" });
  } catch (err) {
    next(err);
  }
}

export async function getMyItems(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const items = await prisma.item.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    return res.json(items);
  } catch (err) {
    next(err);
  }
}