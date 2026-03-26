import mongoose from "mongoose";

const getMongoUri = () => {
  if (process.env.MONGO_URI) {
    return process.env.MONGO_URI;
  }

  const host = process.env.MONGO_HOST;

  if (!host) {
    throw new Error("MONGO_URI or MONGO_HOST must be defined");
  }

  const port = process.env.MONGO_PORT || "27017";
  const dbName = process.env.MONGO_DB_NAME || "house-rental-platform";
  const username = process.env.MONGO_USER;
  const password = process.env.MONGO_PASSWORD;
  const auth =
    username && password
      ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@`
      : "";

  return `mongodb://${auth}${host}:${port}/${dbName}`;
};

const connectDB = async () => {
  const mongoUri = getMongoUri();

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};

export default connectDB;
