import { email, z } from "zod";
import { UserSchema } from "../types/user.type";

/**
 * CREATE USER DTO
 */
export const CreateUserDto = z
  .object({
    fullName: z.string().min(3, "Full name is required"),
    username: z.string().min(3, "Username is required"),
    email: z.string().email("Valid email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
    role: z.enum(["admin", "user"]).optional(),
    phoneNumber: z.string().optional(),
    profilePicture: z.string().url().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CreateUserDto = z.infer<typeof CreateUserDto>;

/**
 * UPDATE USER DTO
 */

export const UpdateUserDto = UserSchema.partial();
export type UpdateUserDto = z.infer<typeof UpdateUserDto>;

/**
 * LOGIN USER DTO
 */
export const LoginUserDto = z.object({
  email: z.string().min(3, "valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginUserDto = z.infer<typeof LoginUserDto>;
