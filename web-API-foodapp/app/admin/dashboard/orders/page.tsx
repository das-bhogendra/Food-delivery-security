"use client";
import React, { useEffect, useState } from "react";
import { OrderProvider, useOrders } from "@/app/context/OrderContext";
import OrderList from "./components/OrderList";

const AdminOrdersPageInner = () => {
  const { orders, fetchOrders, editOrder, isLoading } = useOrders();
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= FILTER + SORT ================= */
  useEffect(() => {
    let filtered = orders ? [...orders] : [];

    if (statusFilter) {
      filtered = filtered.filter(
        (order) => order.status === statusFilter
      );
    }

    filtered.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      if (sortBy === "date") {
        aVal = new Date(a.createdAt || 0).getTime();
        bVal = new Date(b.createdAt || 0).getTime();
      } else if (sortBy === "total") {
        aVal = a.totalAmount;
        bVal = b.totalAmount;
      } else {
        aVal = a.id;
        bVal = b.id;
      }

      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

    setFilteredOrders(filtered);
  }, [orders, statusFilter, sortBy, sortOrder]);

  /* ================= STATUS UPDATE ================= */
  const handleStatusUpdate = async (
    orderId: string,
    newStatus: string
  ) => {
    if (!confirm(`Change order status to "${newStatus}"?`)) return;

    try {
      await editOrder(orderId, { status: newStatus as any });
      fetchOrders();
    } catch (error) {
      alert("Failed to update order status");
    }
  };

  /* ================= STATS ================= */
  const totalOrders = orders?.length || 0;
  const totalRevenue =
    orders?.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    ) || 0;

  const pendingOrders =
    orders?.filter((o) => o.status === "pending").length || 0;

  const deliveredOrders =
    orders?.filter((o) => o.status === "delivered").length || 0;

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-500 animate-pulse">
          Loading Orders...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Order Management
        </h1>
        <p className="text-gray-500 mt-2">
          Monitor and manage customer orders
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Orders" value={totalOrders} />
        <StatCard title="Total Revenue" value={`$${totalRevenue}`} />
        <StatCard title="Pending Orders" value={pendingOrders} />
        <StatCard title="Delivered Orders" value={deliveredOrders} />
      </div>

      {/* FILTER CARD */}
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-10">
        <div className="flex flex-wrap gap-6 items-end">

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="date">Date</option>
              <option value="total">Total Amount</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as "asc" | "desc")
              }
              className="px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <button
            onClick={() => fetchOrders()}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition shadow-md"
          >
            Refresh Orders
          </button>
        </div>
      </div>

      {/* ORDERS */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl shadow-lg text-center text-gray-500">
          No orders found.
        </div>
      ) : (
        <OrderList
          orders={filteredOrders}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

/* ================= STAT CARD ================= */
const StatCard = ({ title, value }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-3xl font-bold mt-2 text-gray-800">
      {value}
    </div>
  </div>
);

const AdminOrdersPage = () => (
  <OrderProvider>
    <AdminOrdersPageInner />
  </OrderProvider>
);

export default AdminOrdersPage;