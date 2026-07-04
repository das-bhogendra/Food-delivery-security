"use client";
import React from "react";
import { OrderResponseDto } from "@/app/dtos/order.dto";
import OrderCard from "./OrderCard";

interface Props {
  orders: OrderResponseDto[];
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
}

const OrderList: React.FC<Props> = ({ orders, onStatusUpdate }) => {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center text-gray-500 shadow-sm">
        No orders found
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {orders.map(order => (
        <OrderCard
          key={order.id}
          order={order}
          onStatusUpdate={onStatusUpdate}
        />
      ))}
    </div>
  );
};

export default OrderList;