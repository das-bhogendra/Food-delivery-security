"use server";

import { cookies } from "next/headers";
import {
  loginUser,
  registerUser,
  updateProfile,
} from "../api/auth";
import { setUserData } from "../cookie";

/**
 * Register User
 */
export const handleRegister = async (formData: any) => {
  try {
    const result = await registerUser(formData);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Registration failed",
      };
    }

    return {
      success: true,
      message: result.message || "Registration successful",
      data: result.data,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Registration failed",
    };
  }
};

/**
 * Login User
 */
/**
 * Login User
 */
export const handleLogin = async (formData: any) => {
  try {
    const cookieStore = await cookies();

    // Read CSRF token from cookie
    const csrfToken = cookieStore.get("csrf-token")?.value;

    // Login request
    const result = await loginUser(formData, {
      headers: {
        ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
        ...(csrfToken ? { Cookie: `csrf-token=${csrfToken}` } : {}),
      },
    });

    // Normalize backend response
    const data = result.data ?? result;

    const user = data.user ?? data;
    const token = data.token ?? result.token ?? null;

    if (!user) {
      return {
        success: false,
        message: result.message || "Login failed",
      };
    }

    // Store user in Next.js cookie
    await setUserData(user);

    return {
      success: true,
      message: result.message || "Login successful",
      data: user,
      token,
    };
  } catch (err: any) {
    return {
      success: false,
      message:
        err.response?.data?.message ||
        err.message ||
        "Login failed",
    };
  }
};

/**
 * Update Profile
 */
export const handleUpdateProfile = async (
  profileData: FormData
) => {
  try {
    const result = await updateProfile(profileData);

    if (!result.success) {
      return {
        success: false,
        message:
          result.message || "Failed to update profile",
      };
    }

    await setUserData(result.data);

    return {
      success: true,
      message:
        result.message || "Profile updated successfully",
      data: result.data,
    };
  } catch (err: any) {
    return {
      success: false,
      message:
        err.message || "Failed to update profile",
    };
  }
};

