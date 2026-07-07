import { z } from "zod";

export type FoodItemType = "veg" | "nonVeg" | "drink" | "dessert";
export type MediaType = "photo" | "video";

// ================= XSS CHECK =================
const containsHtml = (value: string) => /<[^>]*>/i.test(value);

// ================= CREATE SCHEMA =================
export const CreateFoodItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Food name must be at least 2 characters")
    .max(100, "Food name cannot exceed 100 characters")
    .refine((value) => !containsHtml(value), {
      message: "HTML tags are not allowed",
    }),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters")
    .refine((value) => !containsHtml(value), {
      message: "HTML tags are not allowed",
    })
    .optional(),

  type: z.enum(["veg", "nonVeg", "drink", "dessert"]),

  price: z.preprocess(
    (value) => {
      if (typeof value === "number") return value;
      if (typeof value === "string" && value.trim() !== "") {
        const n = Number(value);
        return Number.isNaN(n) ? value : n;
      }
      return value;
    },
    z.number().positive("Price must be greater than 0")
  ),


  imageUrl: z
    .string()
    .url("Invalid image URL")
    .optional(),

  mediaType: z
    .enum(["photo", "video"])
    .optional(),

  isAvailable: z
    .preprocess((value) => {
      if (typeof value === "boolean") return value;
      if (typeof value === "string") return value === "true";
      return value;
    }, z.boolean())
    .optional(),


  isBestSeller: z
    .preprocess((value) => {
      if (typeof value === "boolean") return value;
      if (typeof value === "string") return value === "true";
      return value;
    }, z.boolean())
    .optional(),


  isDiscounted: z
    .preprocess((value) => {
      if (typeof value === "boolean") return value;
      if (typeof value === "string") return value === "true";
      return value;
    }, z.boolean())
    .optional(),

});

// ================= UPDATE SCHEMA =================
export const UpdateFoodItemSchema =
  CreateFoodItemSchema.partial();

// ================= DTO TYPES =================
export type CreateFoodItemDto =
  z.infer<typeof CreateFoodItemSchema>;

export type UpdateFoodItemDto =
  z.infer<typeof UpdateFoodItemSchema>;