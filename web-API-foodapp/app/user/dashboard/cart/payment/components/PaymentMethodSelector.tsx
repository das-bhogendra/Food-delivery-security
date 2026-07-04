"use client";

import React from "react";
import { usePayment } from "@/app/context/PaymentContext";

const paymentMethods = [
  {
    id: "card",
    type: "card" as const,
    name: "Card Payment",
    icon: "💳",
    description: "Pay with Visa or Mastercard",
  },
  {
    id: "esewa",
    type: "esewa" as const,
    name: "eSewa",
    icon: "📱",
    description: "Most popular mobile wallet in Nepal",
  },
  {
    id: "imepay",
    type: "imepay" as const,
    name: "IME Pay",
    icon: "📲",
    description: "Pay via IME Pay app or QR",
  },
  {
    id: "connectips",
    type: "connectips" as const,
    name: "ConnectIPS / Bank Transfer",
    icon: "🏦",
    description: "Direct bank payment via ConnectIPS",
  },
  {
    id: "cod",
    type: "cod" as const,
    name: "Cash on Delivery",
    icon: "💵",
    description: "Pay when you receive your order",
  },
];

interface Props {
  onSelect: (method: string) => void;
}

const PaymentMethodSelector: React.FC<Props> = ({ onSelect }) => {
  const { selectedMethod } = usePayment();

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
      {paymentMethods.map((method) => (
        <label
          key={method.id}
          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
            selectedMethod?.type === method.type
              ? "border-green-500 bg-green-50 ring-2 ring-green-200"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value={method.type}
            checked={selectedMethod?.type === method.type}
            onChange={() => onSelect(method.type)}
            className="w-4 h-4 text-green-600"
          />
          <span className="ml-3 text-2xl">{method.icon}</span>
          <div className="ml-3">
            <p className="font-medium">{method.name}</p>
            <p className="text-sm text-gray-500">{method.description}</p>
          </div>
        </label>
      ))}
    </div>
  );
};

export default PaymentMethodSelector;
