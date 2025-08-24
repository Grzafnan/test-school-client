import { api } from "../api";

export interface IQuestion {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    updatedAt: string;
}


export const questionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createQuestion: builder.mutation<IQuestion, Partial<IQuestion>>({
      query: (credentials) => ({
        url: "/questions/create",
        method: "POST",
        body: { ...credentials },
        credentials: "include",
      }),
    }),

    getQuestionsByCompetencyId: builder.query<{ success: boolean; data: IQuestion[] | null }, string>({
      query: (id) => ({
        url: `/questions/competency/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getAllQuestions: builder.query<{ success: boolean; data: IQuestion[] | null }, void>({
      query: () => ({
        url: `/questions`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getQuestionById: builder.query<{ success: boolean; data: IQuestion | null }, string>({
      query: (id) => ({
        url: `/questions/get/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    updateQuestionById: builder.mutation<
      { success: boolean; data: IQuestion | null },
      { id: string; data: Partial<IQuestion> }
    >({
      query: ({ id, data }) => ({
        url: `/questions/update/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
    }),

    removeQuestionById: builder.mutation<{ success: boolean; data: IQuestion | null }, string>({
      query: (id) => ({
        url: `/questions/remove/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateQuestionMutation,
  useUpdateQuestionByIdMutation,
  useRemoveQuestionByIdMutation,
  useGetAllQuestionsQuery,
  useGetQuestionsByCompetencyIdQuery,
  useGetQuestionByIdQuery,
} = questionApi;

