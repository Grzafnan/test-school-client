// authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "./authApi";
import Cookies from 'js-cookie';

export interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ accessToken: string, refreshToken: string }>) => {
      const { accessToken, refreshToken } = action.payload;

  // ✅ Persist tokens in cookies
  Cookies.set('accessToken', accessToken, { secure: true, sameSite: 'Strict' });
  Cookies.set('refreshToken', refreshToken, { secure: true, sameSite: 'Strict' });
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    setProfile: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    hydrateAuth: (state) => {
      state.accessToken = Cookies.get("accessToken") ?? null;
      state.refreshToken = Cookies.get("refreshToken") ?? null;
    },
  },
});

export const { setCredentials, setProfile, logout, setUserLoading, setError, hydrateAuth} = authSlice.actions;

export default authSlice.reducer;
