import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const BerxoRoute: React.FC = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-cinema-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-cinema-300 font-bold tracking-widest uppercase">
          BERXO Yönetim Erişimi Doğrulanıyor...
        </span>
      </div>
    );
  }

  // Not logged in -> Redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin -> Redirect to Home Page
  if (!profile || profile.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
