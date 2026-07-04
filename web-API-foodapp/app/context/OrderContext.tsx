"use client";
import React, { createContext, useContext, useState } from "react";
import { OrderResponseDto, CreateOrderDto, UpdateOrderDto } from "@/app/dtos/order.dto";
import { orderApi } from "../lib/orderApi"; // your new combined orderApi

interface OrderContextType {
  orders: OrderResponseDto[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: (userId?: string) => Promise<void>;
  addOrder: (dto: CreateOrderDto) => Promise<void>;
  editOrder: (id: string, dto: UpdateOrderDto) => Promise<void>;
  removeOrder: (id: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<OrderResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders (admin: all, user: own)
  // NOTE: Using client-side filtering as backend /user/:userId endpoint may not work correctly
  const fetchOrders = async (userId?: string) => {
    setIsLoading(true);
    setError(null);
    setOrders([]); // Clear existing orders before fetching
    try {
      console.log("=== FETCH ORDERS START ===");
      console.log("userId parameter:", userId);
      
      // First, let's try the original endpoint that was supposed to work
      if (userId) {
        console.log("Trying getAllUserOrders first...");
        try {
          const userOrders = await orderApi.getAllUserOrders(userId);
          console.log("getAllUserOrders result:", userOrders);
          if (userOrders && userOrders.length > 0) {
            setOrders(userOrders);
            setIsLoading(false);
            return;
          }
        } catch (e: any) {
          console.log("getAllUserOrders failed:", e.message);
        }
        
        // Fallback: Fetch ALL orders and filter client-side
        console.log("Falling back to getAll and client-side filter...");
        const allOrders = await orderApi.getAll();
        console.log("All orders fetched:", allOrders);
        console.log("Looking for orders with userId:", userId);
        
        if (!allOrders || allOrders.length === 0) {
          console.log("No orders found at all!");
          setOrders([]);
          setIsLoading(false);
          return;
        }
        
        // Filter orders by userId - handle both string and object formats
        // Also handle _id vs id field name mismatch
        const userOrders = allOrders.filter((order: OrderResponseDto) => {
          const orderUserId = typeof order.userId === 'string' 
            ? order.userId 
            : order.userId?._id;
          
          // Debug log each order's userId
          console.log("Order:", order.id, "has userId:", orderUserId, "matching:", orderUserId === userId);
          
          return orderUserId === userId;
        });
        
        console.log("Filtered user orders:", userOrders);
        setOrders(userOrders);
      } else {
        const data = await orderApi.getAll(); // admin fetches all
        console.log("Admin fetch all orders:", data);
        setOrders(data);
      }
      console.log("=== FETCH ORDERS END ===");
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new order (user only)
  const addOrder = async (dto: CreateOrderDto) => {
    const newOrder = await orderApi.create(dto);
    setOrders(prev => [newOrder, ...prev]);
  };

  // Edit order (admin can edit any)
  const editOrder = async (id: string, dto: UpdateOrderDto) => {
    const updatedOrder = await orderApi.update(id, dto);
    setOrders(prev => prev.map(o => (o.id === id ? updatedOrder : o)));
  };

  // Remove order (admin can delete any)
  const removeOrder = async (id: string) => {
    const result = await orderApi.delete(id);
    if (result) setOrders(prev => prev.filter(o => o.id !== id));
  };

  return (
    <OrderContext.Provider
      value={{ orders, isLoading, error, fetchOrders, addOrder, editOrder, removeOrder }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook
export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within OrderProvider");
  return context;
};