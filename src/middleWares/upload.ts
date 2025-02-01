import multer from "multer";
import path from "path";
import { Request,Response } from "express";
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
      },
})

const fileFilter=(req:Request,file:Express.Multer.File,cb: multer.FileFilterCallback)=>{
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type. Only images are allowed."));
      }
}

// Configure multer
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter,
  });

  
export default upload