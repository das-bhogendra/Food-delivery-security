import type { AxiosRequestConfig } from "axios";
import axios from "./axios";
import { API } from "./endpoints";

/**
 * Register User
 */
export const registerUser = async (registerData: any) => {
  try {
    const response = await axios.post(
      API.AUTH.REGISTER,
      registerData
    );

    return response.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message ||
      err.message ||
      "Registration failed"
    );
  }
};

/**
 * Login User
 */
export const loginUser = async (
  loginData: any,
  config: AxiosRequestConfig = {}
) => {
  try {
    const response = await axios.post(
      API.AUTH.LOGIN,
      loginData,
      config
    );

    return response.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message ||
      err.message ||
      "Login failed"
    );
  }
};

/**
 * Get Logged-in User
 */
export const whoAmI = async () => {
  try {
    const response = await axios.get(API.AUTH.WHOAMI, {
      withCredentials: true,
    });

    // Axios interceptor converts 401 -> { data: null }
    if (!response?.data) {
      return null;
    }

    return response.data.data ?? null;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message ||
      err.message ||
      "Whoami failed"
    );
  }
};

/**
 * Update Profile
 */
export const updateProfile = async (profileData: FormData) => {
  try {
    const response = await axios.put(
      API.AUTH.UPDATEPROFILE,
      profileData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message ||
      err.message ||
      "Update profile failed"
    );
  }
};