import axios from "./api/axios"; // configured instance
import { FoodItem } from "../context/FoodContext";
import { API } from "./api/endpoints";

export const foodApi = {
  getAll: async (): Promise<FoodItem[]> => {
    const res = await axios.get(API.USER.FOOD.GET_ALL, { withCredentials: true });
    return res.data.data;
  },

  getByType: async (type: string): Promise<FoodItem[]> => {
    const res = await axios.get(`${API.USER.FOOD.GET_BY_TYPE}${type}`, { withCredentials: true });
    return res.data.data;
  },

  getBestSellers: async (): Promise<FoodItem[]> => {
    const res = await axios.get(API.USER.FOOD.GET_BEST_SELLERS, { withCredentials: true });
    return res.data.data;
  },

  getDiscounted: async (): Promise<FoodItem[]> => {
    const res = await axios.get(API.USER.FOOD.GET_DISCOUNTED, { withCredentials: true });
    return res.data.data;
  },

  getById: async (id: string): Promise<FoodItem> => {
    const res = await axios.get(`${API.ADMIN.FOOD.GET_BY_ID}${id}`, {
      withCredentials: true, // ✅ important for JWT auth
    });
    return res.data.data;
  },

  create: async (formData: FormData): Promise<FoodItem> => {
    const res = await axios.post(API.ADMIN.FOOD.CREATE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return res.data.data;
  },

  update: async (id: string, formData: FormData): Promise<FoodItem> => {
    const res = await axios.put(`${API.ADMIN.FOOD.UPDATE}${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return res.data.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const res = await axios.delete(`${API.ADMIN.FOOD.DELETE}${id}`, {
      withCredentials: true,
    });
    return res.data;
  },
};