import { FoodItemInOrder, OrderResponseDto } from "../dtos/order.dto";

interface BackendOrder {
  _id: string;
  userId: { _id: string; email?: string } | string;
  // Backend may return either 'items' or 'foodItems'
  items?: { foodId: string; name: string; quantity: number; price: number }[];
  foodItems?: { foodId: string; name: string; quantity: number; price: number }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}


export const mapOrder = (order: any): OrderResponseDto => {
  // Handle both 'items' and 'foodItems' from backend
  const items = order.items || order.foodItems || [];
  
  return {
    id: order._id,
    userId: typeof order.userId === "string"
      ? { _id: order.userId, email: "" } // fallback if only string is provided
      : { _id: order.userId._id, email: order.userId.email || "" }, // full object

    foodItems: items.map((f: any): FoodItemInOrder => ({
      _id: f.foodId,
      name: f.name,
      quantity: f.quantity,
      price: f.price,
    })),

    totalAmount: order.totalAmount,
    status: order.status,
    notes: order.notes || "",
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};
