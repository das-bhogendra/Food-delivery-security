import dotenv from "dotenv";
import { connectionDatabase } from "../database/mongodb";
import { UserModel } from "../models/user.model";
import { PasswordUtil } from "../utils/password.utils";

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

async function seed() {
  try {
    await connectionDatabase();
    console.log(" MongoDB connected");

    const existingAdmin = await UserModel.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log(" Admin already exists.");
      process.exit(0);
    }

    const adminPassword = requireEnv("ADMIN_PASSWORD");
    const adminFullName = requireEnv("ADMIN_FULLNAME");
    const adminUsername = requireEnv("ADMIN_USERNAME");
    const adminEmail = requireEnv("ADMIN_EMAIL");

    const hashedPassword = await PasswordUtil.hash(adminPassword);

    await UserModel.create({
      fullName: adminFullName,
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      phoneNumber: "",
    });

    console.log("✅ Admin account created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();

