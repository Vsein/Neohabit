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
    getProject: builder.query({
      query: (id) => ({
        url: `project/${id}`,
      }),
    }),
    createProject: builder.mutation({
      query: (values) => ({
        url: 'project',
        body: values,
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
        url: `project/${projectID}`,
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
    updateProject: builder.mutation({
      query: ({ projectID, values }) => ({
        url: `project/${projectID}`,
        body: values,
        method: 'PUT',
      }),
      onQueryStarted({ projectID, values }, { dispatch }) {
        const patchResult = dispatch(
          projectApi.util.updateQueryData('getProjects', undefined, (draft) => {
            const project = draft.find((project) => project._id == projectID);
            if (project) {
              project.name = values.name;
              project.color = values.color;
              project.description = values.description;
              project.completed = values.completed;
            }
          }),
        );
      },
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
} = projectApi;
