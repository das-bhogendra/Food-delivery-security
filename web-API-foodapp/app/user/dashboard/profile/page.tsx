"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useOrders } from "@/app/context/OrderContext";
import OrderList from "../orders/components/OrderList";

const ProfilePageInner = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { orders, fetchOrders, isLoading, error } = useOrders();
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");

  // Fetch orders for current user once auth is ready
  useEffect(() => {
    console.log("=== PROFILE PAGE EFFECT ===");
    console.log("loading:", loading);
    console.log("user:", user);
    
    if (!loading && user) {
      const userId = user.id || user._id;
      console.log("Fetching orders for userId:", userId);
      if (userId) {
        fetchOrders(userId);
      }
    }
  }, [user, loading]);

  if (loading) return <div className="p-4">Loading profile...</div>;
  if (!user) return <div className="p-4">Please log in to view your profile.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={() => router.push("/user/dashboard")}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">My Profile</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 ${activeTab === "profile" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
        >
          Profile Information
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 ${activeTab === "orders" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
        >
          Order History ({orders.length})
        </button>
      </div>

      {/* PROFILE TAB */}
      {activeTab === "profile" && (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold mb-2">Personal Information</h2>

          <div>
            <p><strong>Name:</strong> {user.name || "N/A"}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Username:</strong> {user.username || "N/A"}</p>
            <p>
              <strong>Member Since:</strong>{" "}
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
            </p>
          </div>

          {/* Optional account statistics */}
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === "delivered").length}
              </div>
              <div className="text-sm text-gray-600">Completed Orders</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded">
              <div className="text-2xl font-bold text-yellow-600">
                ${orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === "orders" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Order History</h2>
          {isLoading ? (
            <div className="text-center py-8">Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              You haven't placed any orders yet.
            </div>
          ) : (
            <OrderList orders={orders} />
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePageInner;