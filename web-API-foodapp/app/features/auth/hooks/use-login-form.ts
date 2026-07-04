'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginSchema, LoginFormData } from "../schema/login.schema";
import { handleLogin } from "@/app/lib/actions/auth-action";
import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";

export function useLoginForm() {
  const { setUser, setIsAuthenticated } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      const response = await handleLogin(data); // API call
      if (response.success) {
        setUser(response.data);
        setIsAuthenticated(true);

        // Redirect based on role
        if (response.data.role === 'admin') {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/user/dashboard");
        }
      } else {
        setError(response.message || "Login failed");
      }
    } catch (error) {
      setError("An unexpected error occurred");
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
  };
}