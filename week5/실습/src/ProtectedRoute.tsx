// ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  role: string;
  allowedRoles: string[];
  children: ReactNode;
}

const ProtectedRoute = ({ role, allowedRoles, children }: ProtectedRouteProps) => {
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
