"use client";
import React from "react";
import { Category } from "@/app/context/CategoryContext";

interface Props {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryFilter: React.FC<Props> = ({ categories, selectedCategoryId, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        className={`px-4 py-2 rounded-full border ${
          selectedCategoryId === null ? "bg-blue-500 text-white" : "bg-white text-gray-700"
        } hover:bg-blue-500 hover:text-white transition`}
        onClick={() => onSelectCategory(null)}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id}
          className={`px-4 py-2 rounded-full border ${
            selectedCategoryId === cat._id ? "bg-blue-500 text-white" : "bg-white text-gray-700"
          } hover:bg-blue-500 hover:text-white transition`}
          onClick={() => onSelectCategory(cat._id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;