"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import CartItem from "./components/CartItem";
import CartSummary from "./components/CartSummary";

const CartPageInner = () => {
  const router = useRouter();
  const { cartItems } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }
    router.push("/user/dashboard/cart/payment");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <button
            onClick={() => router.push("/user/dashboard")}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-extrabold text-gray-900">Your Cart</h1>
        </div>
        <p className="text-gray-500">Review your items before checkout</p>
      </div>

      {/* Empty Cart */}
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="text-8xl animate-bounce">🛒</div>
          <h2 className="text-2xl font-semibold text-gray-800">Your cart is empty!</h2>
          <p className="text-gray-500 max-w-md text-center">
            Looks like you haven’t added anything to your cart yet. Start exploring delicious meals!
          </p>
          <button
            onClick={() => router.push("/user/dashboard/food")}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-md hover:bg-blue-700 hover:scale-105 transition-all duration-300"
          >
            Browse Food
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition-all duration-300 border border-gray-100">
                <CartItem
                  id={item._id}
                  name={item.name}
                  imageUrl={item.imageUrl}
                  price={item.price}
                  quantity={item.quantity}
                />
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="space-y-6 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <CartSummary onCheckout={handleCheckout} />
          </div>
        </div>
      )}
    </div>
  );
};

export default function CartPage() {
  return <CartPageInner />;
}