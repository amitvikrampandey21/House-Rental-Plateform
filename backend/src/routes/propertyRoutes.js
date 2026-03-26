import express from "express";
import {
  contactOwner,
  createProperty,
  deleteProperty,
  getProperties,
  getPropertyById,
  getPropertyStats,
  getRecommendations,
  getSearchSuggestions,
  seedSampleProperties,
  toggleFavorite,
  updateProperty
} from "../controllers/propertyController.js";
import { authorize, optionalProtect, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProperties);
router.get("/stats", getPropertyStats);
router.get("/suggestions", getSearchSuggestions);
router.get("/recommendations", protect, getRecommendations);
router.post("/seed", protect, authorize("owner", "admin"), seedSampleProperties);
router.post("/", protect, authorize("owner", "admin"), createProperty);
router.get("/:id", optionalProtect, getPropertyById);
router.put("/:id", protect, authorize("owner", "admin"), updateProperty);
router.delete("/:id", protect, authorize("owner", "admin"), deleteProperty);
router.post("/:id/favorite", protect, toggleFavorite);
router.post("/:id/contact", protect, contactOwner);

export default router;
