import asyncHandler from "express-async-handler";
import Booking from "../models/Booking.js";
import Property from "../models/Property.js";
import User from "../models/User.js";

export const getAdminOverview = asyncHandler(async (_req, res) => {
  const [users, properties, bookings] = await Promise.all([
    User.find().select("-password").sort({ createdAt: -1 }),
    Property.find().populate("owner", "name email").sort({ createdAt: -1 }),
    Booking.find().populate("property", "title").populate("renter", "name email").sort({ createdAt: -1 })
  ]);

  res.json({
    success: true,
    overview: {
      users,
      properties,
      bookings
    }
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error("Admin cannot delete their own account");
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();

  res.json({
    success: true,
    message: "User removed successfully"
  });
});

export const deletePropertyAsAdmin = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  await property.deleteOne();

  res.json({
    success: true,
    message: "Listing removed successfully"
  });
});
