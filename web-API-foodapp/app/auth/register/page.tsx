'use client';

import Image from "next/image";
import RegisterForm from "../components/forms/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-[450px]">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#111827]">Create Account</h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              Fill in your details to get started
            </p>
          </div>

          <RegisterForm />

          <div className="mt-6 text-center text-xs text-[#6B7280]">
            By creating an account, you agree to our Terms & Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}
