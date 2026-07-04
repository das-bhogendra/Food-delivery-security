"use client";
import React from "react";
import { useCart } from "@/app/context/CartContext";

interface Props {
  onCheckout: () => void;
}

const CartSummary: React.FC<Props> = ({ onCheckout }) => {
  const { totalAmount, cartItems } = useCart();

  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Items ({cartItems.length})</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>$2.99</span>
        </div>
        <div className="flex justify-between font-semibold text-lg border-t pt-2">
          <span>Total</span>
          <span>${(totalAmount + 2.99).toFixed(2)}</span>
        </div>
      </div>
      <button
        onClick={onCheckout}
        disabled={cartItems.length === 0}
        className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;
