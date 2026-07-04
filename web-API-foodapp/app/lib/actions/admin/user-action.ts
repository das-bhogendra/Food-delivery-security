"use server";
import { userApi } from "../../api/admin/user"; // ✅ correct import
import { revalidatePath } from "next/cache";

export const handleCreateUser = async (data: FormData) => {
  try {
    const result = await userApi.create(data);
    if (result.error) {
      return {
        success: false,
        message: result.error,
      };
    }
    if (result.user && result.user._id) {
      revalidatePath("/admin/users");
      return {
        success: true,
        message: "Registration successful",
        data: result.user,
      };
    }

    return {
      success: false,
      message: "Registration failed",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Registration action failed",
    };
  }
};