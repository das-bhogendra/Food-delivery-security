import mongoose, { Schema, Document } from "mongoose";

export interface IOrderFoodItem {
  foodId: mongoose.Types.ObjectId; // original FoodItem _id
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  foodItems: IOrderFoodItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderFoodItemSchema = new Schema<IOrderFoodItem>(
  {
    foodId: { type: Schema.Types.ObjectId, ref: "FoodItem", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    quantity: { type: Number, required: true, default: 1 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    foodItems: { type: [OrderFoodItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "delivered", "cancelled"],
      default: "pending",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", OrderSchema);