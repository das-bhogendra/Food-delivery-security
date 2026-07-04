"use client";
import React from "react";
import { useCart } from "@/app/context/CartContext";

interface Props {
  id: string;
  name: string;
  imageUrl?: string;
  price: number;
  quantity: number;
}

const CartItem: React.FC<Props> = ({ id, name, imageUrl, price, quantity }) => {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="flex items-center justify-between p-4 border rounded shadow-sm bg-white">
      <div className="flex items-center gap-4">
        <img
          src={imageUrl || "/placeholder_food.jpg"}
          alt={name}
          className="w-20 h-20 rounded object-cover"
        />
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-gray-500">${price.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="px-2 py-1 border rounded"
          onClick={() => updateQuantity(id, quantity - 1)}
          disabled={quantity <= 1}
        >
          -
        </button>
        <span>{quantity}</span>
        <button
          className="px-2 py-1 border rounded"
          onClick={() => updateQuantity(id, quantity + 1)}
        >
          +
        </button>
      </div>

      <button
        className="text-red-500 font-bold"
        onClick={() => removeFromCart(id)}
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
