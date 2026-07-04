// app/user/layout.tsx
"use client";
import React from "react";
import UserNavbar from "../auth/components/UserNavbar";
import { CartProvider } from "../context/CartContext";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <UserNavbar />
        <main>{children}</main>
      </div>
    </CartProvider>
  );
}
