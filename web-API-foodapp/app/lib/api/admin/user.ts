// D:\Projects\my-frontend\app\lib\api\admin\user.ts
import axios from "../axios";
import { API } from "../endpoints";

export interface User {
  _id: string;
  fullName?: string;
  username?: string;
  email: string;
  role: string;
  phoneNumber?: string;
  profilePicture?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export const userApi = {
  // GET all users
  getAll: async (): Promise<User[]> => {
    try {
      const res = await axios.get(API.ADMIN.USER.GET_ALL, { withCredentials: true });

      // Flexible array detection (works for data array or data.users)
      if (Array.isArray(res.data.data)) return res.data.data;
      if (res.data.data && Array.isArray(res.data.data.users)) return res.data.data.users;
      if (Array.isArray(res.data.users)) return res.data.users;

      return []; // fallback
    } catch (err: any) {
      console.error("Fetch users failed:", err);
      return [];
    }
  },

  // GET user by ID
  getById: async (id: string): Promise<User | null> => {
    try {
      const res = await axios.get(`${API.ADMIN.USER.GET_BY_ID}${id}`, { withCredentials: true });
      return res.data.data || null;
    } catch (err: any) {
      console.error(`Error fetching user ${id}:`, err);
      return null;
    }
  },

  // CREATE user
  create: async (formData: FormData): Promise<{ user?: User; error?: string }> => {
    try {
      const res = await axios.post(API.ADMIN.USER.CREATE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (!res.data || res.status === 401) {
        return { error: "Unauthorized or server error" };
      }
      return { user: res.data.data || null };
    } catch (err: any) {
      const responseData = err.response?.data;
      let message = "Create user failed";
      if (responseData) {
        if (typeof responseData === 'string') {
          message = responseData;
        } else if (responseData.message) {
          message = responseData.message;
        } else if (responseData.error) {
          message = responseData.error;
        } else {
          message = JSON.stringify(responseData);
        }
      } else {
        message = err.message;
      }
      console.error("Error creating user:", message, responseData);
      return { error: message };
    }
  },

  // UPDATE user
  update: async (id: string, formData: FormData): Promise<{ user?: User; error?: string }> => {
    try {
      const res = await axios.put(`${API.ADMIN.USER.UPDATE}${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return { user: res.data.data || null };
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Update user failed";
      console.error(`Error updating user ${id}:`, message);
      return { error: message };
    }
  },

  // DELETE user
  delete: async (id: string): Promise<{ message: string; error?: string }> => {
    try {
      const res = await axios.delete(`${API.ADMIN.USER.DELETE}${id}`, { withCredentials: true });
      return { message: res.data?.message || "Deleted successfully" };
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Delete failed";
      console.error(`Error deleting user ${id}:`, message);
      return { message: "Delete failed", error: message };
    }
  },
};