// app/dtos/order.dto.ts

export interface FoodItemInOrder {
  _id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderResponseDto {
  id: string;
  userId: { _id: string; email: string }; // change here
  foodItems: FoodItemInOrder[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Backend expects: items with foodId, name, quantity, price
export interface CreateOrderDto {
  foodItems: string[];
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  notes?: string;
}

export interface UpdateOrderDto {
  status?: OrderResponseDto['status'];
  notes?: string;
}
