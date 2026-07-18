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
      // IMPORTANT: do the login request in the browser so Express `Set-Cookie` reaches the user agent.
      // This is the minimal fix for the auth_token cookie not being stored when using a Server Action.
      const response = await axios.post(API.AUTH.LOGIN, data, {
        // axios instance already has withCredentials: true.
        headers: {},
      });

      // Backend responds with { success, data, token, message }
      if (response.data?.success) {
        const user = response.data.data;
        setUser(user);
        setIsAuthenticated(true);



        // Redirect based on role
        if (response.data.role === 'admin') {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/user/dashboard");
        }
      } else {
        const msg = response.data?.message || "Login failed";
        setError(msg);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Login failed";
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
  };
}