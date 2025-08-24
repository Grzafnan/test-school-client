import { api } from "../api";
import { IAssessment } from "../../../interfaces/common";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// --------------------
// API Definition
// --------------------
const assessmentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all assessments
    getAllAssessment: builder.query<ApiResponse<IAssessment[]>, void>({
      query: () => `/competencies`,
      providesTags: ["Assessment"],
    }),

    // Get single assessment
    getSingleAssessment: builder.query<ApiResponse<IAssessment>, string>({
      query: (level) => `/competencies/level/${level}`,
      providesTags: ["Assessment"],
    }),

    // Create assessment
    createAssessment: builder.mutation<ApiResponse<IAssessment>, Partial<IAssessment>>({
      query: (data) => ({
        url: `/competencies/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Assessment"],
    }),

     // Create assessment
    createAssessmentSession: builder.mutation({
      query: (data) => ({
        method: "POST",
        credentials: "include",
        url: `/sessions/create`,
        body: {...data},
      }),
      invalidatesTags: ["Assessment"],
    }),

    // Delete assessment
    deleteAssessment: builder.mutation<ApiResponse<{ deletedId: string }>, string>({
      query: (id) => ({
        url: `/competencies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Assessment"],
    }),
  }),
});

export const {
  useGetAllAssessmentQuery,
  useGetSingleAssessmentQuery,
  useCreateAssessmentMutation,
  useCreateAssessmentSessionMutation,
  useDeleteAssessmentMutation,
} = assessmentApi;