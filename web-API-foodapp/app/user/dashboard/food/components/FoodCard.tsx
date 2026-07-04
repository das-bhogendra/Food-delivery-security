"use client";
import React from "react";
import { FoodItem } from "../../../../context/FoodContext";
import { useCart } from "../../../../context/CartContext";

interface Props {
  food: FoodItem;
}

const FoodCard: React.FC<Props> = ({ food }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(food);
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100">
      
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={food.imageUrl || "/placeholder-food.jpg"}
          alt={food.name}
          className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70" />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex gap-2">
          {food.isBestSeller && (
            <span className="text-xs bg-yellow-400 text-black font-semibold px-3 py-1 rounded-full shadow-md">
              🔥 Best Seller
            </span>
          )}
          {food.isDiscounted && (
            <span className="text-xs bg-green-500 text-white font-semibold px-3 py-1 rounded-full shadow-md">
              💸 Discount
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {!food.isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-lg font-semibold tracking-wide">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
          {food.name}
        </h3>

        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {food.description}
        </p>

        {/* Price & Button */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-extrabold text-gray-900">
            ${food.price}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={!food.isAvailable}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300
              ${
                food.isAvailable
                  ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-md"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            {food.isAvailable ? "Add +" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;