import { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
    >
      {children}
    </button>
  );
}
