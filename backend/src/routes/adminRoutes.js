import express from "express";
import { deletePropertyAsAdmin, deleteUser, getAdminOverview } from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/overview", getAdminOverview);
router.delete("/users/:id", deleteUser);
router.delete("/properties/:id", deletePropertyAsAdmin);

export default router;
