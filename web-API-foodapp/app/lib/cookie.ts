"use server";
import { cookies } from "next/headers";

const isProduction = process.env.NODE_ENV === "production";

const secureCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "strict" as const,
  path: "/",
  maxAge: 60 * 60 * 24, // 1 day, adjust as needed
};

export const setUserData = async (userData: any) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "user_data",
    value: JSON.stringify(userData),
    ...secureCookieOptions,
  });
};

export const getUserData = async () => {
  const cookieStore = await cookies();
  const userData = cookieStore.get("user_data")?.value;
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

// Frontend clears only user_data. auth_token is managed ONLY by the Express backend.
export const clearAuthCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("user_data");
};

