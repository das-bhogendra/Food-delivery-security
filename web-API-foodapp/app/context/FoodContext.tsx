"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { foodApi } from "../lib/foodApi";

export interface FoodItem {
  _id: string;
  name: string;
  description?: string;
  type: "veg" | "nonVeg" | "drink" | "dessert";
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  isBestSeller: boolean;
  isDiscounted: boolean;
  mediaType?: "photo" | "video";
  quantity?: number; 
}

interface FoodContextType {
  foods: FoodItem[];
  fetchFoods: () => Promise<void>;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export const FoodProvider = ({ children }: { children: React.ReactNode }) => {
  const [foods, setFoods] = useState<FoodItem[]>([]);

  const fetchFoods = async () => {
    try {
      const data = await foodApi.getAll();
      setFoods(data);
    } catch (error) {
      console.error("Error fetching foods:", error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  return <FoodContext.Provider value={{ foods, fetchFoods }}>{children}</FoodContext.Provider>;
};

export const useFood = () => {
  const context = useContext(FoodContext);
  if (!context) throw new Error("useFood must be used within FoodProvider");
  return context;
};