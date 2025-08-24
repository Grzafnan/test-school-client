import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import { logout, setCredentials, setProfile, setUserLoading } from './authApi/authSlice';
import Cookies from 'js-cookie';
import { IUser } from './authApi/authApi';

// ---------------------------
// Base Query with Headers
// ---------------------------
const rawBaseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api/v1',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = Cookies.get('accessToken') || state.auth.accessToken;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// ---------------------------
// Base Query with Re-auth
// ---------------------------
const baseQueryWithReauth: typeof rawBaseQuery = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401 || result.error?.status === 403 ) {

      const refreshResult = await rawBaseQuery(
        { url: '/auth/refresh-token', method: 'POST' },
        api,
        extraOptions
      );

      if (refreshResult.data?.success && refreshResult.data.data?.accessToken) {
        const { accessToken, refreshToken } = refreshResult.data.data;

        api.dispatch(setUserLoading(true));
        api.dispatch(setCredentials({ accessToken, refreshToken }));
        const profileResult = await rawBaseQuery(
          { url: '/auth/profile', method: 'GET' },
          api,
          extraOptions
        );
        if (profileResult.data) {
          api.dispatch(setProfile(profileResult.data.data as IUser));
          api.dispatch(setUserLoading(false));
        }

        // ✅ Retry original request
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        console.log("⛔ Refresh failed — logging out");
        api.dispatch(logout());
      }
    }
  return result;
};

// ---------------------------
// RTK API Service
// ---------------------------
export const api = createApi({
  reducerPath: 'basedApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Assessment', 'Session'],
  endpoints: () => ({}),
});
