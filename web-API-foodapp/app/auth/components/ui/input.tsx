import { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string; 
}

export default function Input({ error, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <input
        {...props}
        className={`w-full border p-2 rounded outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
