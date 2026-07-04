"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole = 'user' }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (loading) return; // wait for auth to resolve

    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }

    if (requiredRole === 'admin' && user?.role !== 'admin') {
      router.replace('/user/dashboard');
      return;
    }

    if (requiredRole === 'user' && user?.role === 'admin') {
      router.replace('/admin/dashboard');
      return;
    }
  }, [loading, isAuthenticated, user, requiredRole, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center">Access denied</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;