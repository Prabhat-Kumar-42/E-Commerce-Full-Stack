import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/cart.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

// /src/routes/cart.routes.ts

const router = Router();

// All cart routes require login
router.get("/", authenticate, getCart);
router.post("/", authenticate, addToCart);
router.put("/:id", authenticate, updateCartItem);
router.delete("/:id", authenticate, removeFromCart);

export default router;
