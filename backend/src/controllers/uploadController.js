import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary.js";

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file && !req.body.image) {
    res.status(400);
    throw new Error("No image provided");
  }

  if (cloudinary) {
    const source = req.body.image || `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(source, {
      folder: "house-rental-platform"
    });

    return res.status(201).json({
      success: true,
      imageUrl: result.secure_url
    });
  }

  res.status(201).json({
    success: true,
    imageUrl: req.body.image,
    message: "Cloudinary not configured, keeping the provided image URL/base64 data"
  });
});
