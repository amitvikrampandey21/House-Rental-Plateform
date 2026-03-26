import User from "../models/User.js";

export const ensureAdminSeed = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    return;
  }

  await User.create({
    name: "Platform Admin",
    email,
    password,
    role: "admin"
  });

  console.log("Admin account seeded");
};
