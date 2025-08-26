import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useUser();
  const location = useLocation();

  const hasToken = (() => {
    try {
      return !!localStorage.getItem('authToken');
    } catch {
      return false;
    }
  })();

  if (!isAuthenticated || !hasToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default PrivateRoute;


