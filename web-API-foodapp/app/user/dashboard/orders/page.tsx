"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { OrderProvider, useOrders } from "@/app/context/OrderContext";
import { useAuth } from "@/app/context/AuthContext";
import OrderList from "./components/OrderList";

const OrdersPageInner = () => {
  const { user, loading } = useAuth();
  const { orders, fetchOrders, isLoading } = useOrders();

  useEffect(() => {
    console.log("=== ORDERS PAGE EFFECT ===");
    console.log("loading:", loading);
    console.log("user:", user);
    console.log("user.id:", user?.id);
    console.log("user._id:", user?._id);
    console.log("user.email:", user?.email);
    
    if (!loading && user) {
      const userId = user.id || user._id;
      console.log("Calling fetchOrders with:", userId);
      if (userId) {
        fetchOrders(userId);
      } else {
        console.error("No user ID found! User object:", user);
      }
    }
  }, [user, loading]);

  // 🔄 Loading Skeleton
  if (loading || isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100"
          >
            <div className="h-5 w-1/4 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // 📭 Empty State
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center space-y-6">
        <div className="text-8xl animate-bounce">🛒</div>
        <h2 className="text-3xl font-bold text-gray-800">No Orders Yet</h2>
        <p className="text-gray-500 max-w-md">
          You haven’t placed any orders yet. Explore our delicious menu and place your first order!
        </p>
        <a
          href="/user/food"
          className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          Browse Food
        </a>
      </div>
    );
  }

  // 📦 Orders List
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <OrderList orders={orders} />
    </div>
  );
};

const OrdersPage = () => {
  const router = useRouter();

  return (
    <OrderProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Header */}
          <div className="mb-12">
            <button
              onClick={() => router.push("/user/dashboard")}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              My Orders
            </h1>
            <p className="text-gray-500 mt-2 max-w-lg">
              Track and manage all your recent purchases with ease.
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-4xl shadow-2xl p-10 border border-gray-100">
            <OrdersPageInner />
          </div>
        </div>
      </div>
    </OrderProvider>
  );
};

export default OrdersPage;