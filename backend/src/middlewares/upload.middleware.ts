import multer from "multer";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import type { AuthRequest } from "./auth.middleware.js";
import { Blob } from "buffer";

// /src/middlewares/upload.middleware.ts

const SUPABASE_URL= process.env.SUPABASE_URL as string;
const SUPABASE_KEY= process.env.SUPABASE_KEY as string;
const SUPABASE_BUCKET= process.env.SUPABASE_BUCKET as string;

// Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Check if the environment is 'local' or something else
const isLocal = process.env.NODE_ENV === "local";

// File filter: Only accept image files
// File filter: Only accept image files
const fileFilter = (req: AuthRequest, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

// Local storage configuration
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const localUpload = multer({
  storage: localStorage,
  fileFilter,
});

// Supabase storage middleware
const supabaseStorage = multer({
  storage: multer.memoryStorage(),
  fileFilter,
});

const supabaseUpload = async (req: any, res: any, next: any) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "Image file is required" });
  }
  console.log("req.file:", file);
  const filePath = `product-images/${Date.now()}-${Math.round(
    Math.random() * 1e9
  )}${path.extname(file.originalname)}`;

  const blob = new Blob([file.buffer], { type: file.mimetype });

  const { data, error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(filePath, blob, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    return res.status(500).json({ error: error.message });
  }

  const { data: publicData } = supabase.storage
    .from(SUPABASE_BUCKET)
    .getPublicUrl(filePath);

  req.fileUrl = publicData.publicUrl;

  next();
};

export const upload = (req: any, res: any, next: any) => {
  if (isLocal) {
    localUpload.single("image")(req, res, () => {
      if (!req.file) {
        return res.status(400).json({ error: "Image file is required" });
      }
      req.fileUrl = `/uploads/${req.file.filename}`;
      next();
    });
  } else {
    supabaseStorage.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      supabaseUpload(req, res, next);
    });
  }
};
