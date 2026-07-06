
import { z } from "zod";


export const UserSchema = z.object({
  username: z.string().min(3, "Username is required"),

  email: z.string().email("Valid email is required"),

  role: z.enum(["admin", "user"]).default("user"),

  password: z.string().min(8, "Password must be at least 8 characters"),

  fullName: z.string().min(3, "Full name is required"),

  phoneNumber: z.string().optional(),

  profilePicture: z.string().url().optional(),

  age: z.number().int().positive().optional(),

  imageUrl: z.string().optional(),

  // ===== Security Fields =====
  failedLoginAttempts: z.number().default(0),

  lockUntil: z.date().nullable().optional(),

  lastLogin: z.date().nullable().optional(),
});


export type User = z.infer<typeof UserSchema>;


