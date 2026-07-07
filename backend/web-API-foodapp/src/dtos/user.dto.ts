import { z } from "zod";
import { UserSchema } from "../types/user.type";
const containsHtml = (value: string) => /<[^>]*>/.test(value);
export const CreateUserDto = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters")
      .max(100, "Full name is too long")
      .refine(
       (value) => !containsHtml(value),
       {
        message: "HTML tags are not allowed in full name",
       }
  ),

    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can contain only letters, numbers and underscores"
      )
      .refine(
      (value) => !containsHtml(value),
      {
        message: "HTML tags are not allowed",
      }
      ),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password cannot exceed 64 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,64}$/,
        "Password must contain uppercase, lowercase, number and special character"
      ),

    confirmPassword: z
      .string()
      .min(8, "Confirm password is required"),

    phoneNumber: z
      .string()
      .trim()
      .regex(
        /^[0-9]{10}$/,
        "Phone number must contain exactly 10 digits"
      )
      .optional(),

    profilePicture: z.string().url().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type CreateUserDto = z.infer<typeof CreateUserDto>;

export const UpdateUserDto = UserSchema.partial();
export type UpdateUserDto = z.infer<typeof UpdateUserDto>;



export const LoginUserDto = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, "Email or username is required")
    .max(100, "Email or username is too long"),


  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type LoginUserDto = z.infer<typeof LoginUserDto>;







