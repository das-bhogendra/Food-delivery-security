"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { foodApi } from "../../../lib/foodApi";
import { FoodItem } from "../../../context/FoodContext";

const AdminFoodPage = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const data = await foodApi.getAll();
      setFoods(data);
    } catch (error) {
      console.error("Error fetching foods:", error);
      alert("Failed to fetch food items");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this food item?")) return;

    try {
      await foodApi.delete(id);
      fetchFoods();
    } catch (error) {
      console.error("Failed to delete food:", error);
      alert("Failed to delete food item");
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              🍽 Manage Food Items
            </h1>
            <p className="text-gray-500 mt-1">
              Create, update, and manage your restaurant menu.
            </p>
          </div>

          <Link
            href="/admin/dashboard/food/create"
            className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-md hover:bg-blue-700 hover:scale-105 transition-all duration-300"
          >
            + Create New Food
          </Link>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : foods.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🍔</div>
            <h2 className="text-xl font-semibold text-gray-800">
              No Food Items Yet
            </h2>
            <p className="text-gray-500 mt-2 max-w-md">
              Start by adding your first menu item to display in the customer app.
            </p>
            <Link
              href="/admin/dashboard/food/create"
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-md hover:bg-blue-700 transition-all duration-300"
            >
              Add First Food
            </Link>
          </div>
        ) : (
          /* Food Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {foods.map((food) => (
              <div
                key={food._id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={food.imageUrl || "/food_photos/placeholder_food.jpg"}
                    alt={food.name}
                    className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {food.isBestSeller && (
                      <span className="bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full shadow">
                        🔥 Bestseller
                      </span>
                    )}
                    {food.isDiscounted && (
                      <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                        💸 Discount
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {food.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 capitalize">
                    {food.type}
                  </p>

                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-lg font-extrabold text-gray-900">
                      ${food.price}
                    </span>

                    <div className="flex gap-3">
                      <Link
                        href={`/admin/dashboard/food/edit/${food._id}`}
                        className="text-blue-600 text-sm font-semibold hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(food._id)}
                        className="text-red-600 text-sm font-semibold hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFoodPage;