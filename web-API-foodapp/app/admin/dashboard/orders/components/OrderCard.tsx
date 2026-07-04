"use client";
import React from "react";
import { OrderResponseDto } from "@/app/dtos/order.dto";

interface Props {
  order: OrderResponseDto;
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-emerald-100 text-emerald-700";
    case "cancelled":
      return "bg-red-100 text-red-600";
    case "confirmed":
      return "bg-blue-100 text-blue-600";
    case "preparing":
      return "bg-purple-100 text-purple-600";
    case "ready":
      return "bg-indigo-100 text-indigo-600";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const OrderCard: React.FC<Props> = ({ order, onStatusUpdate }) => {
  return (
    <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            Order #{order.id}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {new Date(order.createdAt || Date.now()).toLocaleString()}
          </p>
        </div>

        {!onStatusUpdate ? (
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide ${getStatusColor(
              order.status
            )}`}
          >
            {order.status.toUpperCase()}
          </span>
        ) : (
          <select
            value={order.status}
            onChange={(e) => onStatusUpdate(order.id, e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        )}
      </div>

      {/* TOTAL SECTION */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6">
        <p className="text-sm text-gray-500">Total Amount</p>
        <p className="text-3xl font-extrabold text-emerald-600 mt-1">
          ${order.totalAmount}
        </p>
      </div>

      {/* NOTES */}
      {order.notes && (
        <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-500 font-medium mb-1">Customer Notes</p>
          <p className="text-sm text-gray-700">{order.notes}</p>
        </div>
      )}

      {/* ITEMS */}
      {order.foodItems && order.foodItems.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-sm tracking-wide">
            ORDER ITEMS
          </h3>

          <div className="space-y-3">
            {order.foodItems.map((item, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition px-4 py-3 rounded-xl"
              >
                <div>
                  <p className="font-medium text-gray-700">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    ${item.price * item.quantity}
                  </p>
                  <p className="text-xs text-gray-400">
                    ${item.price} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;