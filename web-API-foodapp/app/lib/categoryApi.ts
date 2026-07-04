import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005/api";

export const getAllCategories = async () => {
  const res = await axios.get(`${API_URL}/categories`);
  return res.data.data;
};

export const getCategoriesByUser = async (userId: string) => {
  const res = await axios.get(`${API_URL}/categories/user/${userId}`);
  return res.data.data;
};

export const createCategory = async (category: { name: string; description?: string }) => {
  const res = await axios.post(`${API_URL}/categories`, category, { withCredentials: true });
  return res.data.data;
};

export const updateCategory = async (id: string, category: { name: string; description?: string }) => {
  const res = await axios.put(`${API_URL}/categories/${id}`, category, { withCredentials: true });
  return res.data.data;
};

export const deleteCategory = async (id: string) => {
  const res = await axios.delete(`${API_URL}/categories/${id}`, { withCredentials: true });
  return res.data.success;
};
export {};