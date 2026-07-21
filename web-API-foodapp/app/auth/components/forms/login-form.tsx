'use client';

import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import { useLoginForm } from "../../../features/auth/hooks/use-login-form";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    error,
    setCaptchaToken, // add this
  } = useLoginForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-200 mb-1.5">
          Email / Username
        </label>
        <input
          type="text"
          placeholder="Enter your email or username"
          {...register("identifier")}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 dark:bg-zinc-900/50 dark:border-white/15 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 dark:text-zinc-100"
        />
        {errors.identifier && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">
            {errors.identifier.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-200">
            Password
          </label>
          <Link href="#" className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300">
            Forgot password?
          </Link>
        </div>
        <input
          type="password"
          placeholder="Enter your password"
          {...register("password")}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 dark:bg-zinc-900/50 dark:border-white/15 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 dark:text-zinc-100"
        />
        {errors.password && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Google reCAPTCHA */}
      <div className="flex justify-center">
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          onChange={(token) => setCaptchaToken(token)}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-600 dark:text-red-300 text-sm text-center bg-red-50 dark:bg-red-900/30 py-2 rounded-lg">
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

      <div className="text-center text-gray-600 dark:text-zinc-300">
        Don't have an account?{" "}
        <Link href="/auth/register" className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium">
          Create one
        </Link>
      </div>

    </form>
  );
}
