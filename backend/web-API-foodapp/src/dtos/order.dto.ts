// ================= CREATE ORDER =================
export interface CreateOrderDto {
  userId: string;
  foodItems: string[]; // array of FoodItem _id
  status?: "pending" | "confirmed" | "delivered" | "cancelled";
  notes?: string;
}

// ================= UPDATE ORDER =================
export interface UpdateOrderDto {
  userId?: string;
  foodItems?: string[]; // optional
  status?: "pending" | "confirmed" | "delivered" | "cancelled";
  notes?: string;
}

// ================= DELETE ORDER =================
export interface DeleteOrderDto {
  id: string;
}

// ================= GET ORDER BY ID =================
export interface GetOrderByIdDto {
  id: string;
}

// ================= GET ORDERS BY USER =================
export interface GetOrdersByUserDto {
  userId: string;
}

// ================= ORDER RESPONSE =================
export interface OrderResponseDto {
  id: string;
  userId: string;
  foodItems: {
    _id: string; // frontend expects _id
    name: string;
    price: number;
    imageUrl?: string;
    quantity: number;
  }[];
  totalAmount: number;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
