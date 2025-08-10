import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner } from '../components/Spinner/Spinner';
import { useAppSelector } from '../redux/hooks';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const {accessToken, loading} = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (accessToken && accessToken) {
    return children;
  }
  if (loading) {
    return <Spinner />
  }

  return <Navigate to="/login" state={{ from: location }} replace />
};

export default PrivateRoute;