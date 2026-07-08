"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FoodProvider, useFood } from "@/app/context/FoodContext";
import { CategoryProvider, useCategory } from "../../../context/CategoryContext";
import FoodList from "./components/FoodList";
import CategoryFilter from "./components/CategoryFilter";
import { useCart } from "@/app/context/CartContext";

const FoodPageInner = () => {
  const router = useRouter();
  const { foods } = useFood();
  const { categories } = useCategory();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [showBestSellers, setShowBestSellers] = useState(false);
  const [showDiscounted, setShowDiscounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFoods, setFilteredFoods] = useState(foods);

  useEffect(() => {
    let filtered = foods;

    if (selectedCategory) filtered = filtered.filter(f => f.type === selectedCategory);
    if (selectedType) filtered = filtered.filter(f => f.type === selectedType);
    if (showBestSellers) filtered = filtered.filter(f => f.isBestSeller);
    if (showDiscounted) filtered = filtered.filter(f => f.isDiscounted);
    if (searchTerm) {
      filtered = filtered.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFoods(filtered);
  }, [selectedCategory, selectedType, showBestSellers, showDiscounted, searchTerm, foods]);

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Our Menu</h1>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search foods..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded-lg mb-4 bg-white text-black placeholder:text-gray-500 focus:text-black caret-black"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Types</option>
            <option value="veg">Veg</option>
            <option value="nonVeg">Non-Veg</option>
            <option value="dessert">Dessert</option>
            <option value="drink">Drink</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showBestSellers}
            onChange={e => setShowBestSellers(e.target.checked)}
          />
          Best Sellers
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showDiscounted}
            onChange={e => setShowDiscounted(e.target.checked)}
          />
          Discounted
        </label>
      </div>

      {/* Food List */}
      <FoodList foods={filteredFoods} />
    </div>
  );
};

const FoodPage = () => (
  <CategoryProvider>
    <FoodProvider>
      <FoodPageInner />
    </FoodProvider>
  </CategoryProvider>
);


export default FoodPage;