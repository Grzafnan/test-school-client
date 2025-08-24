import { api } from "../api";
import { ISession } from "../../../interfaces/common";
import { ApiResponse } from "../assessmentApi/assessment.api";

// --------------------
// API Definition
// --------------------
const sessionApi = api.injectEndpoints({
    
  endpoints: (builder) => ({
    // Get all sessions
    getAllSession: builder.query<ApiResponse<ISession[]>, void>({
      query: () => `/sessions`,
      providesTags: ["Session"],
    }),

    // Get single session
    getSingleSession: builder.query<ApiResponse<ISession>, string>({
      query: (level) => `/sessions/level/${level}`,
      providesTags: ["Session"],
    }),

    // Create session
    createSession: builder.mutation<ApiResponse<ISession>, Partial<ISession>>({
      query: (data) => ({
        url: `/sessions/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Session"],
    }),

    // Delete session
    deleteSession: builder.mutation<ApiResponse<{ deletedId: string }>, string>({
      query: (id) => ({
        url: `/sessions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Session"],
    }),
  }),
});

export const {
  useGetAllSessionQuery,
  useGetSingleSessionQuery,
  useCreateSessionMutation,
  useDeleteSessionMutation,
} = sessionApi;