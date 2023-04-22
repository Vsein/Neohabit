import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { current } from '@reduxjs/toolkit';

export const todolistApi = createApi({
  reducerPath: 'todolistApi',
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
    getFilters: builder.query({
      query: () => ({
        url: 'filters',
      }),
    }),
    getTasks: builder.query({
      query: () => ({
        url: 'tasks',
      }),
      providesTags: ['Task'],
    }),
    createTask: builder.mutation({
      query: (values) => ({
        url: 'task',
        body: values,
        method: 'POST',
      }),
      async onQueryStarted(values, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        const patchResult = dispatch(
          todolistApi.util.updateQueryData('getTasks', undefined, (draft) => {
            draft.push(res.data);
          }),
        );
      },
    }),
    updateTask: builder.mutation({
      query: ({ taskID, values }) => ({
        url: `task/${taskID}`,
        body: values,
        method: 'PUT',
      }),
      onQueryStarted({ taskID, values }, { dispatch }) {
        const patchResult = dispatch(
          todolistApi.util.updateQueryData('getTasks', undefined, (draft) => {
            const task = draft.find((task) => task._id == taskID);
            if (task) {
              task.name = values.name;
              task.description = values.description;
              task.completed = values.completed;
            }
          }),
        );
        // catches because of unexpected response in JSON
        // queryFulfilled.catch(patchResult.undo)
      },
    }),
    deleteTask: builder.mutation({
      query: (taskID) => ({
        url: `task/${taskID}`,
        method: 'DELETE',
      }),
      onQueryStarted(taskID, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todolistApi.util.updateQueryData('getTasks', undefined, (draft) => {
            const index = draft.findIndex((task) => task._id == taskID);
            draft.splice(index, 1);
          }),
        );
      },
    }),
  }),
});

export const {
  useGetFiltersQuery,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = todolistApi;
