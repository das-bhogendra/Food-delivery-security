
"use client";
import React from "react";
import { FoodItem } from "../../../../context/FoodContext";
import FoodCard from "./FoodCard";

interface Props {
  foods: FoodItem[];
}

const FoodList: React.FC<Props> = ({ foods }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {foods.map((food) => (
        <FoodCard key={food._id} food={food} />
      ))}
    </div>
  );
};

export default FoodList;