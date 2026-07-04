"use client";
import React from "react";
import { FoodItem } from "../../../../context/FoodContext";

interface Props {
  food: FoodItem;
}

const FoodCard: React.FC<Props> = ({ food }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
      
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={food.imageUrl || "/food_photos/placeholder_food.jpg"}
          alt={food.name}
          className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70"></div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {food.isBestSeller && (
            <span className="bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full shadow">
              🔥 Best Seller
            </span>
          )}
          {food.isDiscounted && (
            <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              💸 Discount
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
          {food.name}
        </h3>

        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {food.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-extrabold text-gray-900">
            ${food.price}
          </span>

          <button className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 hover:scale-105 transition-all duration-300">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;