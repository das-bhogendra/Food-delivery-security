
import { z } from "zod";

// ---------------- User Schema (DB / Core Model) ----------------
export const UserSchema = z.object({
  // MongoDB ObjectId, optional when creating new user
  username: z.string().min(3, "Username is required"),
  email: z.string().email("Valid email is required"),
  role: z.enum(["admin", "user"]).default("user"),
  password: z.string().min(6, "Password must be at least 6 characters"),

  fullName: z.string().min(3, "Full name is required"),
  phoneNumber: z.string().optional(),
  profilePicture: z.string().url().optional(),
  age: z.number().int().positive().optional(),
  imageUrl:z.string().optional()
});

// Type from schema
export type User = z.infer<typeof UserSchema>;

