import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useGetCurrentUserQuery } from '../../redux/api/authApi/authApi';
import { setProfile } from '../../redux/api/authApi/authSlice';
import { Spinner } from '../Spinner/Spinner';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");

  const { loading } = useAppSelector((s) => s.auth);
  const { refetch, data, isLoading } = useGetCurrentUserQuery(undefined, { skip: !(accessToken && refreshToken) });

  useEffect(() => {
    if (!isLoading && data?.data) {
      dispatch(setProfile(data.data));
    }
  }, [dispatch, isLoading, data]);
  
  useEffect(() => {
    if (accessToken && refreshToken) {
      refetch();
    }
  }, [accessToken, refreshToken, refetch]);

  if (loading || isLoading) return <div className='h-screen flex flex-col items-center justify-center'>
    <h1 className='text-xl font-bold'>Auth...</h1>
    <Spinner />
  </div>;

  return <>{children}</>;
}

export default AuthProvider;