'use client';

import Link from "next/link";
import { useLoginForm } from "../../../features/auth/hooks/use-login-form";

export default function LoginForm() {
  const { register, handleSubmit, onSubmit, errors, isSubmitting, error } = useLoginForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
        <input
          type="text"
          placeholder="Enter your email"
          {...register("email")}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <Link href="#" className="text-sm text-orange-600 hover:text-orange-700">
            Forgot password?
          </Link>
        </div>
        <input
          type="password"
          placeholder="Enter your password"
          {...register("password")}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-600 text-sm text-center bg-red-50 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 rounded-lg font-medium transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>

      <div className="text-center text-gray-600">
        Don't have an account?{" "}
        <Link href="/auth/register" className="text-orange-600 hover:text-orange-700 font-medium">
          Create one
        </Link>
      </div>

    </form>
  );
}