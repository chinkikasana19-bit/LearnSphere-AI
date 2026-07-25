import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.resolve("uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDir),
  filename: (_req, file, callback) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    callback(null, `${Date.now()}-${safeName}`);
  }
});

function fileFilter(_req, file, callback) {
  if (file.mimetype !== "application/pdf") {
    return callback(new Error("Only PDF files are allowed"));
  }
  callback(null, true);
}

export const uploadPdf = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 }
});
