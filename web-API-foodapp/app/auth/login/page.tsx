'use client';

import LoginForm from '../components/forms/login-form';
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function LoginPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.role === 'admin') {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/user/dashboard");
      }
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FACC15] border-b-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-[450px]">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#111827]">Sign In</h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              Enter your credentials to access your account
            </p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center text-xs text-[#6B7280]">
            By continuing, you agree to our Terms & Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}
