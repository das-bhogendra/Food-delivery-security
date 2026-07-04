"use client";
import React, { useState } from "react";
import { OrderResponseDto } from "@/app/dtos/order.dto";
import { useOrders } from "../../../../context/OrderContext";

interface Props {
  order: OrderResponseDto;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "preparing":
      return "bg-blue-100 text-blue-800";
    case "confirmed":
      return "bg-yellow-100 text-yellow-800";
    case "ready":
      return "bg-indigo-100 text-indigo-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const OrderCard: React.FC<Props> = ({ order }) => {
  const { removeOrder, editOrder } = useOrders();
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [status, setStatus] = useState<OrderResponseDto["status"]>(order.status);

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setLoadingCancel(true);
    try {
      await removeOrder(order.id);
      alert("Order cancelled successfully");
    } catch (error) {
      alert("Failed to cancel order");
    } finally {
      setLoadingCancel(false);
    }
  };

  const handleStatusChange = async (newStatus: OrderResponseDto["status"]) => {
    setStatus(newStatus); // Optimistic UI
    setLoadingUpdate(true);
    try {
      await editOrder(order.id, { status: newStatus });
      alert("Order status updated!");
    } catch (error) {
      alert("Failed to update order");
      setStatus(order.status);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const canCancel = status === "pending" || status === "confirmed";

  return (
    <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl shadow-lg p-6 mb-6 hover:shadow-2xl transition-all duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Order #{order.id}</h3>
          <p className="text-sm text-gray-500">
            Ordered on {new Date(order.createdAt || Date.now()).toLocaleString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      {/* Total */}
      <div className="mb-4">
        <p className="text-gray-600 text-sm">Total Amount</p>
        <p className="text-2xl font-bold text-green-600">${order.totalAmount}</p>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="mb-4 bg-gray-50 rounded-lg p-3 text-gray-600 text-sm">
          <span className="font-medium">Notes:</span> {order.notes}
        </div>
      )}

      {/* Items */}
      {order.foodItems && order.foodItems.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-700 mb-2">Items</h4>
          <div className="space-y-2">
            {order.foodItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50/80 rounded-lg px-3 py-2 text-sm shadow-sm hover:shadow-md transition"
              >
                <span>{item.name} x {item.quantity}</span>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Update Status */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Update Status:</label>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value as OrderResponseDto["status"])}
          disabled={loadingUpdate || status === "delivered" || status === "cancelled"}
          className="border p-2 rounded-lg w-full md:w-1/2 focus:ring-2 focus:ring-blue-400 outline-none transition"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Cancel Button */}
      {canCancel && (
        <button
          onClick={handleCancelOrder}
          disabled={loadingCancel}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 shadow-md hover:shadow-lg transition-all"
        >
          {loadingCancel ? "Cancelling..." : "Cancel Order"}
        </button>
      )}
    </div>
  );
};

export default OrderCard;