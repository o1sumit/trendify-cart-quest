import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useUser();

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;


