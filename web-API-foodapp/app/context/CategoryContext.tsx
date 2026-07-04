"use client";
export {};
import React, { createContext, useContext, useEffect, useState } from "react";
import { getAllCategories } from "../lib/categoryApi";

export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryContextProps {
  categories: Category[];
  refreshCategories: () => void;
}

const CategoryContext = createContext<CategoryContextProps>({
  categories: [],
  refreshCategories: () => {},
});

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const refreshCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, refreshCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);