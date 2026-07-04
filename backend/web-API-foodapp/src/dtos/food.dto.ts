// src/dtos/food.dto.ts

export type FoodItemType = "veg" | "nonVeg" | "drink" | "dessert";
export type MediaType = "photo" | "video"; // ✅ added

// ================= CREATE DTO =================
export interface CreateFoodItemDto {
  name: string;
  description?: string;
  type: FoodItemType;
  price: number;
  imageUrl?: string;

  mediaType?: MediaType; // ✅ added (photo/video)

  isAvailable?: boolean; // default true

  isBestSeller?: boolean; // ✅ added (default false)
  isDiscounted?: boolean; // ✅ added (default false)

  addedBy: string; // userId as string
}

// ================= UPDATE DTO =================
export interface UpdateFoodItemDto {
  name?: string;
  description?: string;
  type?: FoodItemType;
  price?: number;
  imageUrl?: string;

  mediaType?: MediaType; // ✅ added

  isAvailable?: boolean;

  isBestSeller?: boolean; // ✅ added
  isDiscounted?: boolean; // ✅ added
}
