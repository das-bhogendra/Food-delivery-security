import React from 'react';
import ProtectedRoute from '../auth/components/ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
}