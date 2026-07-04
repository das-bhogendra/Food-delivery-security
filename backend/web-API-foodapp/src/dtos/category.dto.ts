// src/dtos/category.dto.ts

// ================= CREATE CATEGORY =================
export interface CreateCategoryDto {
  name: string;
  description?: string;
  addedBy: string; // user ID
}

// ================= UPDATE CATEGORY =================
export interface UpdateCategoryDto {
  id: string; // required to identify the category
  name: string;
  description?: string;
  addedBy: string; // user ID
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
