import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
  const token = localStorage.getItem("token"); // o "usuario"

  return token ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
