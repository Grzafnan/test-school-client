import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

interface PrivateRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const ProtectedAdminRoute = ({ children, allowedRoles }: PrivateRouteProps)  => {
    const location = useLocation();
const { isAuthenticated, user } = useAppSelector((state: RootState) => state.auth);
  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If route has role restrictions
  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;