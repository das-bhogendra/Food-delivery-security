import mongoose, { Schema, Document } from "mongoose";

export enum FoodItemType {
  VEG = "veg",
  NON_VEG = "nonVeg",
  DRINK = "drink",
  DESSERT = "dessert",
}

export interface IFoodItem extends Document {
  name: string;
  description?: string;
  type: FoodItemType;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  addedBy: mongoose.Types.ObjectId;
  isBestSeller: boolean;   // <-- new
  isDiscounted: boolean;   // <-- new
  createdAt: Date;
  updatedAt: Date;
}

const foodItemSchema = new Schema<IFoodItem>(
  {
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["veg", "nonVeg", "drink", "dessert"], required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    isAvailable: { type: Boolean, default: true },
    addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isBestSeller: { type: Boolean, default: false },   // default false
    isDiscounted: { type: Boolean, default: false },   // default false
  },
  { timestamps: true }
);

export const FoodItem = mongoose.model<IFoodItem>("FoodItem", foodItemSchema);
