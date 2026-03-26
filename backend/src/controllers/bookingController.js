import asyncHandler from "express-async-handler";
import Booking from "../models/Booking.js";
import Property from "../models/Property.js";

export const createBooking = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.body.propertyId).populate("owner", "name email");

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  const booking = await Booking.create({
    property: property._id,
    renter: req.user._id,
    owner: property.owner._id,
    moveInDate: req.body.moveInDate,
    durationMonths: req.body.durationMonths,
    message: req.body.message,
    contactEmail: req.body.contactEmail || req.user.email,
    contactPhone: req.body.contactPhone || req.user.phone
  });

  const populated = await booking.populate([
    { path: "property", select: "title location city price images status" },
    { path: "renter", select: "name email phone" },
    { path: "owner", select: "name email phone" }
  ]);

  res.status(201).json({
    success: true,
    message: "Rental request sent successfully",
    booking: populated
  });
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const filter = req.user.role === "owner" ? { owner: req.user._id } : { renter: req.user._id };

  const bookings = await Booking.find(filter)
    .populate("property", "title location city price images")
    .populate("renter", "name email phone")
    .populate("owner", "name email phone")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    bookings
  });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only owners can update booking requests");
  }

  booking.status = req.body.status;
  await booking.save();

  if (req.body.status === "accepted") {
    await Property.findByIdAndUpdate(booking.property, { status: "pending" });
  }

  const populated = await booking.populate([
    { path: "property", select: "title location city price images status" },
    { path: "renter", select: "name email phone" },
    { path: "owner", select: "name email phone" }
  ]);

  res.json({
    success: true,
    message: `Booking ${req.body.status}`,
    booking: populated
  });
});
