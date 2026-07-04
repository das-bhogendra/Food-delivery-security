"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";

const UserNavbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-full px-6">
        <div className="flex justify-between items-center h-16">

          
          <Link href="/user/dashboard" className="flex items-center gap-3">
            <Image
              src="/assets/icons/foodlogo.jpg"
              alt="Food Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-bold text-orange-600">
              FoodWorld
            </span>
          </Link>

          
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600 hidden md:block">
              Welcome, {user?.name || user?.email}
            </span>

            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-600 hover:text-red-600 transition"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;