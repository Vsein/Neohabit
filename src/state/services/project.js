import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { current } from '@reduxjs/toolkit';

export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:9000/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => ({
        url: 'projects',
      }),
    }),
    createProject: builder.mutation({
      query: (values) => ({
        url: 'project/create',
        body: new URLSearchParams(values),
        method: 'POST',
      }),
      async onQueryStarted(values, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        const patchResult = dispatch(
          projectApi.util.updateQueryData('getProjects', undefined, (draft) => {
            draft.push(res.data);
          }),
        );
      },
    }),
    deleteProject: builder.mutation({
      query: (projectID) => ({
        url: `project/${projectID}/delete`,
        method: 'DELETE',
      }),
      onQueryStarted(projectID, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          projectApi.util.updateQueryData('getProjects', undefined, (draft) => {
            const index = draft.findIndex((project) => project._id == projectID);
            draft.splice(index, 1);
          }),
        );
      },
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;
