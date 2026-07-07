// src/config.ts
import dotenv from "dotenv";

// Load .env variables
dotenv.config();

export const PORT: number = process.env.PORT
  ? parseInt(process.env.PORT, 10)
  : 5005;

// MongoDB Atlas URI
export const MONGODB_URI: string = process.env.MONGODB_URI!; // ✅ the ! ensures TypeScript knows it's required

// JWT Secret
export const JWT_SECRET: string =
  process.env.JWT_SECRET || "foodapp_default_jwt_secret";

// Optional: debug to make sure env is loaded
console.log("Loaded config:");
console.log("PORT:", PORT);
console.log("MONGODB_URI:", MONGODB_URI ? "✅ Loaded" : "Undefined");
console.log("JWT_SECRET:", JWT_SECRET ? "✅ Loaded" : "Undefined");

