import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import itemRoutes from "./routes/items.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import { jwtErrorHandler } from "./error-handlers/jwt.error-handler.js";
import path from "path";
import { globalErrorHandler } from "./error-handlers/global.error-handler.js";
import { nonExistingRoutesErrorHandler } from "./error-handlers/non-existing-routes.error-handler.js";
import helmet from "helmet";
dotenv.config();

// /src/app.ts

const __dirname = path.resolve();

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/health", (req, res) => res.send("API is running..."));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/cart", cartRoutes);

// Global error handler
app.use(nonExistingRoutesErrorHandler);
app.use(jwtErrorHandler);
app.use(globalErrorHandler);

export default app;
