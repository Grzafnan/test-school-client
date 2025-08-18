import { api } from "../api";


export interface IUser {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data: {
    user: IUser;
    accessToken: string; // JWT token
    refreshToken: string; // Refresh token
  };
}

export interface IGetCurrentUserResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: IUser;
}

export interface IRefreshResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user?: IUser;
  };
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: { ...credentials },
        // credentials: 'include', // include cookies
      }),
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        credentials: 'include',
      }),
    }),
    getCurrentUser: builder.query<IGetCurrentUserResponse, void>({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
        credentials: 'include',
      }),
    }),
    getRefreshToken: builder.mutation<IRefreshResponse, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
        credentials: "include", // important to send refreshToken cookie
      }),
    }),
  }),
  // overrideExisting: false,
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetRefreshTokenMutation,
  useGetCurrentUserQuery,
} = authApi;
