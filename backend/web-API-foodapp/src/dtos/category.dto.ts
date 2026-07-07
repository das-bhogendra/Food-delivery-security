// src/dtos/category.dto.ts

import { z } from "zod";

const containsHtml = (value: string) => /<[^>]*>/.test(value);
console.log(containsHtml("<script>alert('XSS')</script>"));

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .refine((value) => !containsHtml(value), {
      message: "HTML tags are not allowed",
    }),

  description: z
    .string()
    .trim()
    .max(500)
    .refine((value) => !containsHtml(value), {
      message: "HTML tags are not allowed",
    })
    .optional(),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

// ================= CREATE CATEGORY =================
export interface CreateCategoryDto {
  name: string;
  description?: string;
}

// ================= UPDATE CATEGORY =================
export interface UpdateCategoryDto {
  name?: string;
  description?: string;

}

// ================= DELETE CATEGORY =================
export interface DeleteCategoryDto {
  id: string;
}

// ================= GET CATEGORY BY ID =================
export interface GetCategoryByIdDto {
  id: string;
}

// ================= GET CATEGORIES BY USER =================
export interface GetCategoriesByUserDto {
  addedBy: string; // user ID
}

// ================= CATEGORY RESPONSE =================
export interface CategoryResponseDto {
  id: string;
  name: string;
  description?: string;
  addedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
