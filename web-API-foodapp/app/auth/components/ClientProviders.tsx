"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "@/app/context/AuthContext";
import { CartProvider } from "@/app/context/CartContext";
import { OrderProvider } from "@/app/context/OrderContext";

export const ClientProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <OrderProvider>
        <CartProvider>{children}</CartProvider>
      </OrderProvider>
    </AuthProvider>
  );
};