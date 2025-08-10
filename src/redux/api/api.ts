// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'basedApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: "http://localhost:5000/api/v1/",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken
          || localStorage.getItem("accessToken");

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        headers.set("Content-Type", "application/json");
        return headers;
      },
  }),
  tagTypes: ['User', 'Assessment'],
  endpoints: () => ({
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints    