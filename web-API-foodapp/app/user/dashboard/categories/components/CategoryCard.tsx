"use client";
import React from "react";
import { Category } from "../../../../context/CategoryContext";

interface Props {
  category: Category;
}

const CategoryCard: React.FC<Props> = ({ category }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition cursor-pointer">
      <h3 className="text-lg font-semibold">{category.name}</h3>
      {category.description && <p className="text-gray-500 mt-1">{category.description}</p>}
      <p className="text-sm text-gray-400 mt-2">Created at: {new Date(category.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default CategoryCard;