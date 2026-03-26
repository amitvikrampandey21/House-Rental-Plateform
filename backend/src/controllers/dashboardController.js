import asyncHandler from "express-async-handler";
import Booking from "../models/Booking.js";
import Property from "../models/Property.js";
import User from "../models/User.js";

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const baseUser = await User.findById(req.user._id)
    .select("-password")
    .populate("favorites", "title price location city type images status");

  const [bookings, ownedProperties, recommendationPool] = await Promise.all([
    Booking.find(req.user.role === "owner" ? { owner: req.user._id } : { renter: req.user._id })
      .populate("property", "title location city price images")
      .sort({ createdAt: -1 }),
    req.user.role === "owner"
      ? Property.find({ owner: req.user._id }).sort({ createdAt: -1 })
      : Promise.resolve([]),
    Property.find({ status: "available" }).sort({ isFeatured: -1, createdAt: -1 }).limit(4)
  ]);

  res.json({
    success: true,
    dashboard: {
      user: baseUser,
      bookings,
      favorites: baseUser.favorites,
      ownedProperties,
      recommendations: recommendationPool
    }
  });
});
