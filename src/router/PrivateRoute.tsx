import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner } from '../components/Spinner/Spinner';
import { useAppSelector } from '../redux/hooks';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { accessToken, loading } = useAppSelector((state) => state.auth);
  if (loading) {
    return <div className='h-screen flex items-center justify-center'>
      <Spinner />
    </div>;
  }

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
