// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    const isAuthenticated = !!token;
  
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
  
    return <>{children}</>;
  };
  
  export default ProtectedRoute;
