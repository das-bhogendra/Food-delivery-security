"use client";

import { useState } from "react";
import { foodApi } from "../../../../lib/foodApi";
import { FoodItem } from "../../../../context/FoodContext";


interface Props {
  onSuccess?: () => void;
}

export default function CreateFoodForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    type: "veg",
    available: true,
    bestSeller: false,
    image: null as File | null,
  });

  
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  
  const handleImageChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0] || null,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Build FormData (must match backend Zod schema keys)
      const data = new FormData();
      data.append("name", formData.name);

      // IMPORTANT: multipart/form-data still reaches Express as strings.
      // Convert in a way that backend Zod can interpret into numbers/booleans.
      // Backend schema expects: price:number, isAvailable:boolean, isBestSeller:boolean, isDiscounted:boolean
      const priceNumber = Number(formData.price);
      data.append("price", String(priceNumber));

      data.append("type", formData.type);
      data.append("isAvailable", formData.available ? "true" : "false");
      data.append("isBestSeller", formData.bestSeller ? "true" : "false");
      data.append("isDiscounted", "false");
      if (formData.image) data.append("foodPhoto", formData.image); // must match backend key


      // Call API — token handled via cookie
      await foodApi.create(data);


      alert("Food item created successfully!");
      onSuccess?.();

      // Reset form
      setFormData({
        name: "",
        price: "",
        type: "veg",
        available: true,
        bestSeller: false,
        image: null,
      });

    } catch (error: any) {
      console.error("Create Food Error:", error);

      const msg = error?.response?.data?.message;
      // Zod returns an array of issues; make it readable for the user.
      const readableMessage = Array.isArray(msg)
        ? msg
            .map((i: any) => (i?.message ? String(i.message) : null))
            .filter(Boolean)
            .join("\n")
        : msg;

      alert(
        readableMessage || "Failed to create food item."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-6">Create New Food</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block mb-2 text-sm font-medium">Food Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl bg-white text-black placeholder:text-gray-500 focus:ring-2 focus:ring-[#FACC15] focus:text-black caret-black outline-none"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-2 text-sm font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block mb-2 text-sm font-medium">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="veg">Veg</option>
            <option value="nonVeg">Non-Veg</option>
            <option value="dessert">Dessert</option>
            <option value="drink">Drink</option>
          </select>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
            />
            Available
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="bestSeller"
              checked={formData.bestSeller}
              onChange={handleChange}
            />
            Best Seller
          </label>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-2 text-sm font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition-all"
        >
          {loading ? "Creating..." : "Create Food"}
        </button>
      </form>
    </div>
  );
}