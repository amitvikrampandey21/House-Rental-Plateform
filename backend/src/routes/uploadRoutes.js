import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/uploadController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", protect, authorize("owner", "admin"), upload.single("imageFile"), uploadImage);

export default router;
