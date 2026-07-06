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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-b-4"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-slate-950 dark:via-zinc-950 dark:to-neutral-900 p-4">
      
      {/* LEFT SIDE - BRAND SECTION (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 h-screen bg-orange-600 items-center justify-center flex-col p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <Image
              src="/assets/images/hero-bg.jpg"
              alt="Food Image"
              width={400}
              height={400}
              className="object-contain max-h-[300px] w-auto mx-auto"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Welcome Back</h1>
          <p className="text-orange-100 text-lg">Sign in to continue your culinary journey</p>
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN SECTION */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-zinc-900/80 border border-transparent dark:border-white/10 rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mb-2">Sign In</h1>
              <p className="text-gray-500 dark:text-zinc-300">Enter your credentials to access your account</p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>

    </div>
  );
}