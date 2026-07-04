"use client";
import React from "react";
import { OrderResponseDto } from "@/app/dtos/order.dto";
import OrderCard from "./OrderCard";

interface Props {
  orders: OrderResponseDto[];
}

const OrderList: React.FC<Props> = ({ orders }) => {
  return (
    <div>
      {orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrderList;