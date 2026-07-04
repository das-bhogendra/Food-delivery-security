"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { usePayment, PaymentProvider } from "@/app/context/PaymentContext";
import { useOrders } from "@/app/context/OrderContext";
import { useAuth } from "@/app/context/AuthContext";
import { CreateOrderDto } from "@/app/dtos/order.dto";
import { PaymentDetails, paymentApi } from "@/app/lib/paymentApi";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import CardPaymentForm from "./components/CardPaymentForm";

const DELIVERY_FEE = 2.99;

const PaymentPageContent = () => {
  const router = useRouter();
  const { cartItems, clearCart, totalAmount } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();

  const {
    selectedMethod,
    setSelectedMethod,
    setPaymentDetails,
    isProcessing,
    setIsProcessing,
    paymentError,
    setPaymentError,
    setPaymentSuccess,
    setTransactionId,
  } = usePayment();

  const [orderId, setOrderId] = useState<string | null>(null);

  const handleMethodSelect = (method: string) => {
    setSelectedMethod({
      id: method,
      type: method as "card" | "esewa" | "imepay" | "connectips" | "cod",
    });
    setPaymentError(null);
  };

  const handlePayNow = async () => {
    if (!selectedMethod) {
      setPaymentError("Please select a payment method");
      return;
    }

    if (selectedMethod.type === "cod") {
      await processPayment();
    }
  };

  const handleCardPayment = async () => {
    const cardNumber = (document.getElementById("cardNumber") as HTMLInputElement)?.value;
    const cardHolder = (document.getElementById("cardHolder") as HTMLInputElement)?.value;
    const expiryDate = (document.getElementById("expiryDate") as HTMLInputElement)?.value;
    const cvv = (document.getElementById("cvv") as HTMLInputElement)?.value;

    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      setPaymentError("Please fill in all card details");
      return;
    }

    const details: PaymentDetails = {
      cardNumber: cardNumber.replace(/\s/g, ""),
      cardHolder,
      expiryDate,
      cvv,
    };

    setPaymentDetails(details);
    await processPayment(details);
  };

  const processPayment = async (details?: PaymentDetails) => {
    if (!user || cartItems.length === 0) {
      setPaymentError("Invalid order or user");
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const paymentMethodMap: Record<string, string> = {
        card: "card",
        cod: "cash_on_delivery",
        esewa: "esewa",
        imepay: "imepay",
        connectips: "connectips",
      };

      const paymentMethod = paymentMethodMap[selectedMethod?.type || "cod"];

      const paymentData = {
        foodItems: cartItems.map((item) => ({
          foodId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: grandTotal,
        paymentMethod: paymentMethod,
        transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      };

      const response = await paymentApi.processPayment(paymentData);

      if (!response.success) {
        throw new Error(response.message || "Payment failed");
      }

      setTransactionId(response.transactionId || paymentData.transactionId);
      setPaymentSuccess(true);

      clearCart();

      setTimeout(() => {
        router.push("/user/dashboard/orders");
      }, 2000);
    } catch (error: any) {
      console.error("Payment error:", error);
      setPaymentError(error.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const grandTotal = totalAmount + DELIVERY_FEE;

  if (cartItems.length === 0 && !orderId) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center space-y-4">
        <div className="text-8xl animate-bounce">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800">Your cart is empty!</h2>
        <p className="text-gray-500">Add delicious food to your cart and checkout easily.</p>
        <button
          onClick={() => router.push("/user/dashboard/food")}
          className="mt-4 px-6 py-3 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition-all duration-300 hover:scale-105"
        >
          Browse Food
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-3xl font-extrabold text-gray-900">Checkout</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Payment Methods */}
        <div className="space-y-6">
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
            <PaymentMethodSelector onSelect={handleMethodSelect} />
          </div>

          {selectedMethod?.type === "card" && (
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
              <CardPaymentForm />
            </div>
          )}

          {selectedMethod?.type === "esewa" && (
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">eSewa Payment</h3>
              <input
                id="esewaMobile"
                type="text"
                placeholder="Mobile / eSewa ID"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <p className="text-xs text-gray-500 mt-2">You will be redirected to eSewa for approval.</p>
            </div>
          )}

          {selectedMethod?.type === "imepay" && (
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">IME Pay Payment</h3>
              <input
                id="imepayMobile"
                type="text"
                placeholder="Mobile Number"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <p className="text-xs text-gray-500 mt-2">You will receive a confirmation in IME Pay app.</p>
            </div>
          )}

          {selectedMethod?.type === "connectips" && (
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 space-y-4">
              <h3 className="text-lg font-semibold mb-2">ConnectIPS / Bank Transfer</h3>
              <select id="bankName" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none">
                <option value="">Select a bank</option>
                <option value="nmb">NMB Bank</option>
                <option value="nic">NIC Asia</option>
                <option value="sanima">Sanima Bank</option>
                <option value="neb">Nepal Express Bank</option>
                <option value="hbl">HBL Bank</option>
              </select>
              <input
                id="accountNumber"
                type="text"
                placeholder="Account Number"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <p className="text-xs text-red-500 mt-1">Complete payment within 30 minutes.</p>
            </div>
          )}
        </div>

        {/* Right: Order Summary */}
        <div className="space-y-6 sticky top-20">
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between items-center">
                  <span className="text-gray-700 truncate max-w-[180px]">{item.name} x {item.quantity}</span>
                  <span className="font-medium">NPR {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>NPR {totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>NPR {DELIVERY_FEE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>NPR {grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {selectedMethod && (
            <button
              onClick={selectedMethod.type === "cod" ? handlePayNow : handleCardPayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-full font-bold shadow-lg hover:scale-105 hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing Payment..." : selectedMethod.type === "cod" ? `Place Order - Pay NPR ${(grandTotal * 1.5).toFixed(2)} on Delivery` : `Pay NPR ${(grandTotal * 1.5).toFixed(2)}`}
            </button>
          )}

          {paymentError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{paymentError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function PaymentPage() {
  return (
    <PaymentProvider>
      <PaymentPageContent />
    </PaymentProvider>
  );
}