"use client";

import React, { useState, useEffect } from "react";

interface CardPaymentFormProps {
  onSuccess?: () => void;
}

const CardPaymentForm: React.FC<CardPaymentFormProps> = ({ onSuccess }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardType, setCardType] = useState<"visa" | "mastercard" | "amex" | "unknown">("unknown");
  const [focusedField, setFocusedField] = useState<string>("");

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const detectCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, "");
    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    return "unknown";
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      setCardNumber(formatted);
      setCardType(detectCardType(formatted));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value.replace("/", ""));
    setExpiryDate(formatted);
  };

  const getCardLogo = () => {
    switch (cardType) {
      case "visa":
        return (
          <svg viewBox="0 0 48 32" className="h-8 w-auto">
            <path fill="#1A1F71" d="M19.1 9.1L17 6.5h-3.6l2.3 2.6h2.4zM9.5 21.3l-1.3-3.3H5l3.4 8.2h2.2l3.5-8.2h-2.9l-1.7 3.3zm18.3-1.7c0 .9-.5 1.7-1.4 2.1-.7.3-1.3.4-2 .4-1.7 0-2.7-.8-2.7-2.1 0-1.4 1.3-2 2.5-2.4l1.3-.3c.8-.2 1.2-.5 1.2-1 0-.5-.4-.8-1-.8-.6 0-1.1.2-1.5.6l-.8-.7c.6-.8 1.5-1.2 2.5-1.2 1.4 0 2.2.7 2.2 2 0 .8-.5 1.5-2.3 2.2l-1.3.3c-.9.2-1.4.5-1.4 1.1 0 .4.4.7 1 .7.7 0 1.3-.3 1.8-.8l.7.7c-.7.7-1.6 1-2.5 1-.5 0-1 0-1.4-.2.9-.6 1.6-1.3 2-2zm7.3-4.3v2.7h-2.2v2.1h2v2.6h-2v2.9h2.2v2.7h-4.4V9.3h4.4v5.3h-2.1V9.3h2.1zm-27.1 0v11.1H11l2.9-2.2-1.5-2.3c-.5-.8-1.1-1.2-2-1.2-.1 0-.3 0-.5.1v-2.6c.2-.1.4-.1.7-.1.8 0 1.6.5 2 1.4l2.3 3.8h-2.7L19.1 12V9.3h-2.4z"/>
          </svg>
        );
      case "mastercard":
        return (
          <svg viewBox="0 0 48 32" className="h-8 w-auto">
            <circle cx="19" cy="16" r="8" fill="#EB001B"/>
            <circle cx="29" cy="16" r="8" fill="#F79E1B"/>
            <path d="M24 10.3c2.3 1.7 3.8 4.3 3.8 7.4s-1.5 5.7-3.8 7.4c-2.3-1.7-3.8-4.3-3.8-7.4s1.5-5.7 3.8-7.4z" fill="#FF5F00"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2"/>
            <path d="M2 10h20"/>
          </svg>
        );
    }
  };

  const maskCardNumber = (num: string) => {
    const cleaned = num.replace(/\s/g, "");
    if (cleaned.length < 4) return num;
    const last4 = cleaned.slice(-4);
    const masked = "• ".repeat(cleaned.length - 4) + last4;
    return masked.match(/.{1,5}/g)?.join(" ") || masked;
  };

  return (
    <div className="p-4 border rounded-xl bg-white shadow-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        Card Payment
      </h3>
      
      <div className="mb-6">
        <div 
          className="relative h-44 rounded-xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-5 text-white shadow-2xl overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)`
          }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-500/10 to-transparent rounded-full -ml-5 -mb-5"></div>
          
          <div className="flex justify-between items-start mb-8">
            <div className="w-12 h-8 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded flex items-center justify-center">
              <span className="text-xs font-bold text-yellow-900">N</span>
            </div>
            <div className="w-10">
              {getCardLogo()}
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-xs text-white/50 mb-1">Card Number</p>
            <p className="text-xl font-mono tracking-wider">
              {focusedField === "cardNumber" || cardNumber.length === 0 
                ? (cardNumber || "•••• •••• •••• ••••")
                : maskCardNumber(cardNumber)
              }
            </p>
          </div>
          
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-white/50">Card Holder</p>
              <p className="text-sm font-medium uppercase tracking-wide">
                {cardHolder || "YOUR NAME"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/50">Expires</p>
              <p className="text-sm font-medium">{expiryDate || "MM/YY"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
          <div className="relative">
            <input
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardNumberChange}
              onFocus={() => setFocusedField("cardNumber")}
              onBlur={() => setFocusedField("")}
              className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              maxLength={19}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="2"/>
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
          <input
            id="cardHolder"
            type="text"
            placeholder="John Doe"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
            onFocus={() => setFocusedField("cardHolder")}
            onBlur={() => setFocusedField("")}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all uppercase"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input
              id="expiryDate"
              type="text"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={handleExpiryChange}
              onFocus={() => setFocusedField("expiryDate")}
              onBlur={() => setFocusedField("")}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              maxLength={5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
            <div className="relative">
              <input
                id="cvv"
                type="password"
                placeholder="•••"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                onFocus={() => setFocusedField("cvv")}
                onBlur={() => setFocusedField("")}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                maxLength={4}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default CardPaymentForm;
