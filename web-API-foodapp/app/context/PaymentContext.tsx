"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useCart } from "@/app/context/CartContext";
import { PaymentMethod, PaymentDetails, PaymentResponse } from "@/app/lib/paymentApi";

interface PaymentContextProps {
  selectedMethod: PaymentMethod | null;
  setSelectedMethod: (method: PaymentMethod | null) => void;
  paymentDetails: PaymentDetails | null;
  setPaymentDetails: (details: PaymentDetails | null) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  paymentError: string | null;
  setPaymentError: (error: string | null) => void;
  paymentSuccess: boolean;
  setPaymentSuccess: (success: boolean) => void;
  transactionId: string | null;
  setTransactionId: (id: string | null) => void;
  resetPayment: () => void;
}

const PaymentContext = createContext<PaymentContextProps | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const { totalAmount } = useCart();
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const resetPayment = () => {
    setSelectedMethod(null);
    setPaymentDetails(null);
    setIsProcessing(false);
    setPaymentError(null);
    setPaymentSuccess(false);
    setTransactionId(null);
  };

  return (
    <PaymentContext.Provider
      value={{
        selectedMethod,
        setSelectedMethod,
        paymentDetails,
        setPaymentDetails,
        isProcessing,
        setIsProcessing,
        paymentError,
        setPaymentError,
        paymentSuccess,
        setPaymentSuccess,
        transactionId,
        setTransactionId,
        resetPayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) throw new Error("usePayment must be used within PaymentProvider");
  return context;
};
