"use client";

import { useState } from "react";
import { foodApi } from "../../../../lib/foodApi";
import { FoodItem } from "../../../../context/FoodContext";

interface Props {
  food: FoodItem;
  onSuccess?: () => void;
}

export default function UpdateFoodForm({ food, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: food.name,
    price: food.price,
    type: food.type,
    isAvailable: food.isAvailable,
    isBestSeller: food.isBestSeller,
    image: null as File | null,
  });

  // ✅ Image Preview
  const [preview, setPreview] = useState<string>(
    food.imageUrl
      ? food.imageUrl // backend already returns absolute URL
      : "/public/food_photos/placeholder_food.jpg"
  );

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    // ✅ Show preview instantly
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", String(formData.price));
      data.append("type", formData.type);
      data.append("isAvailable", String(formData.isAvailable));
      data.append("isBestSeller", String(formData.isBestSeller));

      // ✅ IMPORTANT: backend expects "foodPhoto"
      if (formData.image) {
        data.append("foodPhoto", formData.image);
      }

      await foodApi.update(food._id, data);

      alert("Food item updated successfully!");
      onSuccess?.();
    } catch (error: any) {
      console.error("Update Food Error:", error);
      alert(error?.response?.data?.message || "Failed to update food item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-6">Update Food</h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ✅ Image Preview */}
        <div className="flex justify-center">
          <img
            src={preview}
            alt="Food Preview"
            className="w-40 h-40 object-cover rounded-xl border"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block mb-2 text-sm font-medium">Food Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-2 text-sm font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block mb-2 text-sm font-medium">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl"
          >
            <option value="veg">Veg</option>
            <option value="nonVeg">Non-Veg</option>
            <option value="dessert">Dessert</option>
            <option value="drink">Drink</option>
          </select>
        </div>

        {/* Toggles */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
            />
            Available
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isBestSeller"
              checked={formData.isBestSeller}
              onChange={handleChange}
            />
            Best Seller
          </label>
        </div>

        {/* Upload */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Upload New Image
          </label>
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
          className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700"
        >
          {loading ? "Updating..." : "Update Food"}
        </button>
      </form>
    </div>
  );
}