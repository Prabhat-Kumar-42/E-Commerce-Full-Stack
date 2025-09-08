import { Router } from "express";
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getCategories,
} from "../controllers/items.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

// /src/routes/items.routes.ts
const router = Router();

// Public routes
router.get("/", getItems);
router.get("/categories", getCategories);
router.get("/:id", getItemById);

// Protected routes (for admins or CMS usage)
router.post("/", authenticate, upload, createItem);
router.put("/:id", authenticate, upload, updateItem);
router.delete("/:id", authenticate, deleteItem);

export default router;
