import api from './api';

export const todolistApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => ({
        url: 'tasks',
      }),
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
            draft.push({ id: res.data, ...values });
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
            const task = draft.find((t) => t.id === taskID);
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
            const index = draft.findIndex((t) => t.id === taskID);
            draft.splice(index, 1);
          }),
        );
      },
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = todolistApi;
