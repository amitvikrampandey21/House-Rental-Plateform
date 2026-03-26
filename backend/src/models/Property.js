import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    location: {
      type: String,
      required: true,
      index: true
    },
    city: {
      type: String,
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ["Apartment", "Villa", "Studio", "House", "PG"],
      required: true
    },
    bedrooms: {
      type: Number,
      default: 1
    },
    bathrooms: {
      type: Number,
      default: 1
    },
    area: {
      type: Number,
      default: 0
    },
    amenities: {
      type: [String],
      default: []
    },
    images: {
      type: [String],
      default: []
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["available", "pending", "rented"],
      default: "available"
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    coordinates: {
      lat: Number,
      lng: Number
    },
    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

propertySchema.index({ title: "text", description: "text", location: "text", city: "text" });

const Property = mongoose.model("Property", propertySchema);

export default Property;
