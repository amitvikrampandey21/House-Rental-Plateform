import express from "express";
import { createBooking, getMyBookings, updateBookingStatus } from "../controllers/bookingController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getMyBookings);
router.post("/", authorize("renter", "admin"), createBooking);
router.patch("/:id/status", authorize("owner", "admin"), updateBookingStatus);

export default router;
