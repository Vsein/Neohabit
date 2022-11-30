import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { current } from '@reduxjs/toolkit';

export const todolistApi = createApi({
  reducerPath: 'todolistApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:9000/api/' }),
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => ({
        url: 'projects',
        params: { secret_token: localStorage.getItem('token') },
      }),
    }),
    getFilters: builder.query({
      query: () => ({
        url: 'filters',
        params: { secret_token: localStorage.getItem('token') },
      }),
    }),
    getTasks: builder.query({
      query: () => ({
        url: 'tasks',
        params: { secret_token: localStorage.getItem('token') },
      }),
      providesTags: ['Task'],
    }),
    createTask: builder.mutation({
      query: (values) => ({
        url: 'task/create',
        body: new URLSearchParams(values),
        method: 'POST',
        params: { secret_token: localStorage.getItem('token') },
      }),
      async onQueryStarted(values, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        const patchResult = dispatch(
          todolistApi.util.updateQueryData(
            'getTasks',
            undefined,
            (draft) => {
              draft.push(res.data);
            },
          ),
        );
      },
    }),
    updateTask: builder.mutation({
      query: ({ taskID, values }) => ({
        url: `task/${taskID}/update`,
        body: new URLSearchParams(values),
        method: 'POST',
        params: { secret_token: localStorage.getItem('token') },
      }),
      onQueryStarted(
        { taskID, values },
        { dispatch },
      ) {
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
        url: `task/${taskID}/delete`,
        method: 'DELETE',
        params: { secret_token: localStorage.getItem('token') },
      }),
      onQueryStarted(taskID, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todolistApi.util.updateQueryData(
            'getTasks',
            undefined,
            (draft) => {
              const index = draft.findIndex((task) => task._id == taskID);
              draft.splice(index, 1);
            },
          ),
        );
      },
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetFiltersQuery,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = todolistApi;
