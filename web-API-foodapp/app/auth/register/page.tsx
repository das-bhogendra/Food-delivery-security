'use client';

import Image from "next/image";
import RegisterForm from "../components/forms/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-slate-950 dark:via-zinc-950 dark:to-neutral-900 p-4">

      {/* LEFT SIDE - BRAND SECTION (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 h-screen bg-orange-600 items-center justify-center flex-col p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <Image
              src="/assets/images/burger.jpg"
              alt="Food Image"
              width={400}
              height={400}
              className="object-contain max-h-[300px] w-auto mx-auto"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Join Us</h1>
          <p className="text-orange-100 text-lg">Create an account to get started</p>
        </div>
      </div>

      {/* RIGHT SIDE - REGISTER SECTION */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-zinc-900/80 border border-transparent dark:border-white/10 rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mb-2">Create Account</h1>
              <p className="text-gray-500 dark:text-zinc-300">Fill in your details to get started</p>
            </div>
            <RegisterForm />
          </div>
        </div>
      </div>

    </div>
  );
}