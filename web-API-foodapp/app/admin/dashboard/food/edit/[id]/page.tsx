"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FoodItem } from "@/app/context/FoodContext";
import { foodApi } from "@/app/lib/foodApi";
import UpdateFoodForm from "../../components/UpdateFoodForm";

const EditFoodPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [food, setFood] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);

  const id = params.id as string;

  // Debug: confirm ID
  console.log("Food ID from URL:", id);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        setLoading(true);
        const data = await foodApi.getById(id);
        console.log("Fetched food item:", data);
        setFood(data);
      } catch (error) {
        console.error("Error fetching food:", error);
        alert("Failed to load food item");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFood();
  }, [id]);

  const handleSuccess = () => {
    router.push("/admin/dashboard/food");
  };

  if (loading) return <div className="p-4">Loading food item...</div>;
  if (!food) return <div className="p-4">Food item not found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Food Item</h1>
      
      <div className="mb-4">
        <img
          src={food.imageUrl ? `/food_photos/${food.imageUrl}` : "/food_photos/placeholder_food.jpg"}
          alt={food.name}
          className="w-48 h-48 object-cover rounded shadow"
        />
      </div>

      <UpdateFoodForm food={food} onSuccess={handleSuccess} />
    </div>
  );
};

export default EditFoodPage;