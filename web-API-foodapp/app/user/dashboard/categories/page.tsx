"use client";
import React from "react";
import { CategoryProvider, useCategory } from "../../../context/CategoryContext";
import CategoryCard from "./components/CategoryCard";

const UserCategoriesPageInner = () => {
  const { categories } = useCategory();

  if (categories.length === 0) {
    return <p className="text-gray-500 text-center mt-10">No categories available.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {categories.map((category) => (
        <CategoryCard key={category._id} category={category} />
      ))}
    </div>
  );
};

const UserCategoriesPage = () => {
  return (
    <CategoryProvider>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Categories</h1>
        <UserCategoriesPageInner />
      </div>
    </CategoryProvider>
  );
};

export default UserCategoriesPage;