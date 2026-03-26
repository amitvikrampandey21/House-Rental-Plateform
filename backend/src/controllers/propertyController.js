import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Property from "../models/Property.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import { sampleProperties } from "../data/sampleProperties.js";

const buildFilters = (query) => {
  const filters = {};

  if (query.location) {
    filters.$or = [
      { location: { $regex: query.location, $options: "i" } },
      { city: { $regex: query.location, $options: "i" } }
    ];
  }

  if (query.type) {
    filters.type = query.type;
  }

  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) {
      filters.price.$gte = Number(query.minPrice);
    }
    if (query.maxPrice) {
      filters.price.$lte = Number(query.maxPrice);
    }
  }

  if (query.status) {
    filters.status = query.status;
  }

  if (query.ownerId && mongoose.Types.ObjectId.isValid(query.ownerId)) {
    filters.owner = query.ownerId;
  }

  if (query.search) {
    filters.$text = { $search: query.search };
  }

  return filters;
};

export const getProperties = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 9);
  const filters = buildFilters(req.query);
  const skip = (page - 1) * limit;

  const [properties, total] = await Promise.all([
    Property.find(filters)
      .populate("owner", "name email phone avatar")
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Property.countDocuments(filters)
  ]);

  res.json({
    success: true,
    properties,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

export const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate("owner", "name email phone avatar");

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  property.views += 1;
  await property.save();

  if (req.user) {
    const user = await User.findById(req.user._id);
    user.activity.viewedLocations = [...new Set([property.city, ...user.activity.viewedLocations])].slice(0, 5);
    user.activity.viewedTypes = [...new Set([property.type, ...user.activity.viewedTypes])].slice(0, 5);
    await user.save();
  }

  res.json({
    success: true,
    property
  });
});

export const createProperty = asyncHandler(async (req, res) => {
  const property = await Property.create({
    ...req.body,
    owner: req.user._id
  });

  const populated = await property.populate("owner", "name email phone avatar");

  res.status(201).json({
    success: true,
    message: "Property created successfully",
    property: populated
  });
});

export const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  if (property.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You can only update your own properties");
  }

  Object.assign(property, req.body);
  await property.save();

  const populated = await property.populate("owner", "name email phone avatar");

  res.json({
    success: true,
    message: "Property updated successfully",
    property: populated
  });
});

export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  if (property.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You can only delete your own properties");
  }

  await property.deleteOne();

  res.json({
    success: true,
    message: "Property deleted successfully"
  });
});

export const getSearchSuggestions = asyncHandler(async (req, res) => {
  const query = req.query.q || "";

  if (!query.trim()) {
    return res.json({ success: true, suggestions: [] });
  }

  const properties = await Property.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
      { city: { $regex: query, $options: "i" } }
    ]
  })
    .select("title location city")
    .limit(8);

  const suggestions = properties.flatMap((property) => [property.title, property.location, property.city]);

  res.json({
    success: true,
    suggestions: [...new Set(suggestions)].slice(0, 8)
  });
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  const user = await User.findById(req.user._id);
  const exists = user.favorites.some((favoriteId) => favoriteId.toString() === req.params.id);

  if (exists) {
    user.favorites = user.favorites.filter((favoriteId) => favoriteId.toString() !== req.params.id);
  } else {
    user.favorites.push(property._id);
  }

  await user.save();

  res.json({
    success: true,
    message: exists ? "Removed from wishlist" : "Added to wishlist",
    favorites: user.favorites
  });
});

export const contactOwner = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate("owner", "name email");

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  res.json({
    success: true,
    message: `Your message has been prepared for ${property.owner.name}.`,
    contact: {
      ownerName: property.owner.name,
      ownerEmail: property.owner.email
    }
  });
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("favorites");

  const favoriteCities = user.favorites.map((property) => property.city);
  const favoriteTypes = user.favorites.map((property) => property.type);
  const learnedCities = [...favoriteCities, ...user.activity.viewedLocations];
  const learnedTypes = [...favoriteTypes, ...user.activity.viewedTypes];

  const recommendations = await Property.find({
    _id: { $nin: user.favorites.map((property) => property._id) },
    $or: [
      { city: { $in: learnedCities.length ? learnedCities : ["Mumbai", "Bengaluru", "Noida"] } },
      { type: { $in: learnedTypes.length ? learnedTypes : ["Apartment", "Studio"] } }
    ]
  })
    .populate("owner", "name email phone avatar")
    .sort({ isFeatured: -1, views: -1 })
    .limit(6);

  res.json({
    success: true,
    label: "AI-inspired recommendations based on views and wishlist activity",
    recommendations
  });
});

export const seedSampleProperties = asyncHandler(async (req, res) => {
  const existingCount = await Property.countDocuments({ owner: req.user._id });

  if (existingCount > 0) {
    res.status(400);
    throw new Error("Sample properties already exist for this owner");
  }

  const properties = await Property.insertMany(
    sampleProperties.map((property) => ({
      ...property,
      owner: req.user._id
    }))
  );

  res.status(201).json({
    success: true,
    message: "Sample properties created",
    properties
  });
});

export const getPropertyStats = asyncHandler(async (_req, res) => {
  const [properties, bookings, users] = await Promise.all([
    Property.countDocuments(),
    Booking.countDocuments(),
    User.countDocuments()
  ]);

  res.json({
    success: true,
    stats: { properties, bookings, users }
  });
});
