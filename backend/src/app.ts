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
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://*.supabase.co"],
        connectSrc: ["'self'", "https:"],
        fontSrc: ["'self'", "https:", "data:"],
      },
    },
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/health", (req, res) => res.send("API is running..."));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/cart", cartRoutes);

// Serve React static build
app.use(express.static(path.join(__dirname, "../frontend/dist")));
// Serve React index.html for client-side routing
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// Global error handler
app.use(nonExistingRoutesErrorHandler);
app.use(jwtErrorHandler);
app.use(globalErrorHandler);

export default app;
