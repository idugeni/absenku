import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading authentication...</div>; // Atau spinner/komponen loading lainnya
  }

  if (!currentUser) {
    // Pengguna tidak terautentikasi, arahkan ke halaman login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;