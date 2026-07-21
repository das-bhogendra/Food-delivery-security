'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginSchema, LoginFormData } from "../schema/login.schema";
import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";
import axios from "@/app/lib/api/axios";
import { API } from "@/app/lib/api/endpoints";

export function useLoginForm() {
  const { setUser, setIsAuthenticated } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // CAPTCHA token state
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);

    // Check if CAPTCHA is completed
    if (!captchaToken) {
      setError("Please complete the CAPTCHA");
      return;
    }

    try {
      const response = await axios.post(API.AUTH.LOGIN, {
        ...data,
        captchaToken, // Send token to backend
      });

      if (response.data?.success) {
        const user = response.data.data;

        setUser(user);
        setIsAuthenticated(true);

        // Redirect based on role
        if (user.role === "admin") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/user/dashboard");
        }
      } else {
        setError(response.data?.message || "Login failed");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed";

      setError(message);
      console.error("Login failed:", error);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    error,
    setCaptchaToken, // Make sure this is returned
  };
}