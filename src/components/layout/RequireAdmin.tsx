import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface RequireAdminProps {
  children: ReactNode;
}

export const RequireAdmin = ({ children }: RequireAdminProps) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/401" replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/403" replace />;
  }
  return <>{children}</>;
};

