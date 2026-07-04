// frontend/lib/api/admin/blog.ts
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

export const blogApi = {
  getAll: async () => {
    const res = await axios.get(`${BASE_URL}/blogs`);
    return res.data.data;
  },
  getById: async (id: string) => {
    const res = await axios.get(`${BASE_URL}/blogs/${id}`);
    return res.data.data;
  },
  create: async (formData: FormData, token: string) => {
    const res = await axios.post(`${BASE_URL}/blogs`, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },
  update: async (id: string, formData: FormData, token: string) => {
    const res = await axios.put(`${BASE_URL}/blogs/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },
  delete: async (id: string, token: string) => {
    const res = await axios.delete(`${BASE_URL}/blogs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  },
};
