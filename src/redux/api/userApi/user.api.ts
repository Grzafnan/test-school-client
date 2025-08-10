import { api } from "../api";


const userApi = api.injectEndpoints({
  endpoints: (builder: any) => ({
    // get all user data
    getAllUserData: builder.query({
      query: () => `/users`,
      providesTags: ["User"],
      
    }),
    createUser: builder.mutation({
      query: (data: any) => ({
        url: `/users`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    // delete user
    deleteUser: builder.mutation({
      query: (id: string) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
})


export const { useGetAllUserDataQuery, useCreateUserMutation, useDeleteUserMutation } = userApi;