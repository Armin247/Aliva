import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-white">
        <div className="flex flex-col items-center gap-8">
          <img
            src="/logo.svg"
            alt="Aliva logo"
            className="h-28 w-28 animate-pulse"
          />
          <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <div className="text-gray-700 text-base">Preparing your experience…</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;


