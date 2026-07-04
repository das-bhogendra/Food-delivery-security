"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";

export default function Header() {
  const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">

          {/* ================= LEFT SECTION ================= */}
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 group"
          >
            {/* Logo from assets/icons */}
            <div className="relative h-10 w-10">
              <Image
                src="/assets/icons/foodlogo.jpg" // ✅ change filename if needed
                alt="Food Logo"
                fill
                className="object-contain"
              />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-lg font-bold text-black tracking-wide">
                DpopFood
              </span>
              <span className="text-xs text-gray-500 -mt-1">
                Admin Dashboard
              </span>
            </div>
          </Link>

          {/* ================= RIGHT SECTION ================= */}
          <div className="flex items-center gap-6">

            {/* Admin Email */}
            <div className="text-sm text-gray-600 hidden sm:block">
              {user?.email || "admin@dpopfood.com"}
            </div>

            {/* Avatar */}
            <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium border border-black rounded-lg hover:bg-black hover:text-white transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}