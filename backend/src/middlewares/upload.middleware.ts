import multer from "multer";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import type { AuthRequest } from "./auth.middleware.js";

// /src/middlewares/upload.middleware.ts

const SUPABASE_URL= process.env.SUPABASE_URL as string;
const SUPABASE_KEY= process.env.SUPABASE_KEY as string;
const SUPABASE_BUCKET= process.env.SUPABASE_BUCKET as string;

// Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Check if the environment is 'local' or something else
const isLocal = process.env.NODE_ENV === "local";

// File filter: Only accept image files
const fileFilter = (req: AuthRequest, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Allow image files
  } else {
    cb(new Error("Only images are allowed"), false); // Reject non-image files
  }
};

// Local storage configuration (for local development)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Stores the file in the 'uploads/' directory locally
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Use a unique name for the file
  },
});

// Supabase Storage configuration (upload to Supabase)
const supabaseStorage = multer({
  storage: multer.memoryStorage(), // We use memory storage to upload the image directly to Supabase
  fileFilter, // Use the fileFilter to restrict uploads to images
});

// Multer middleware for local storage
export const localUpload = multer({
  storage: localStorage,
  fileFilter, // Use the fileFilter to restrict uploads to images
});

// Multer middleware for Supabase storage (upload to Supabase)
export const supabaseUpload = async (req: any, res: any, next: any) => {
  const file = req.file; // The file from the request

  // Generate a unique filename for the image
  const filePath = `product-images/${Date.now()}-${Math.round(
    Math.random() * 1e9
  )}${path.extname(file.originalname)}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(SUPABASE_BUCKET) // Replace with your Supabase bucket name
    .upload(filePath, file.buffer, {
      cacheControl: "3600", // Cache for an hour
      upsert: false, // Don't overwrite existing files
    });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Once uploaded, add the public URL of the file to the request for further use
  const { data: publicData } = supabase.storage
    .from(SUPABASE_BUCKET)
    .getPublicUrl(filePath);

  const publicUrl = publicData.publicUrl;

  req.fileUrl = publicUrl; // Add the URL to the request object

  next(); // Proceed to the next middleware
};

// Main middleware export
export const upload = (req: any, res: any, next: any) => {
  if (isLocal) {
    // Use local storage when in local environment
    localUpload.single("image")(req, res, () => {
      // After uploading locally, set the fileUrl with a local URL
      const fileName = req.file.filename; // The filename from multer
      req.fileUrl = `/uploads/${fileName}`; // Assuming you're serving the "uploads" folder statically

      next(); // Proceed to the next middleware
    });
  } else {
    // Use Supabase storage for other environments (production, staging, etc.)
    supabaseUpload(req, res, next);
  }
};
