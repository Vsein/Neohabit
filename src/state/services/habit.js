import api from './api';
import { heatmapApi } from './heatmap';

export const habitApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHabits: builder.query({
      query: () => ({
        url: 'habits',
      }),
    }),
    getHabit: builder.query({
      query: (id) => ({
        url: `habit/${id}`,
      }),
    }),
    createHabit: builder.mutation({
      query: (values) => ({
        url: 'habit',
        body: values,
        method: 'POST',
      }),
      async onQueryStarted(values, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        dispatch(
          habitApi.util.updateQueryData('getHabits', undefined, (draft) => {
            draft.push(res.data.habit);
          }),
        );
        dispatch(
          heatmapApi.util.updateQueryData('getHeatmaps', undefined, (draft) => {
            draft.push(res.data.heatmap);
          }),
        );
      },
    }),
    deleteHabit: builder.mutation({
      query: (habitID) => ({
        url: `habit/${habitID}`,
        method: 'DELETE',
      }),
      onQueryStarted(habitID, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          habitApi.util.updateQueryData('getHabits', undefined, (draft) => {
            const index = draft.findIndex((habit) => habit._id == habitID);
            draft.splice(index, 1);
          }),
        );
      },
    }),
    updateHabit: builder.mutation({
      query: ({ habitID, values }) => ({
        url: `habit/${habitID}`,
        body: values,
        method: 'PUT',
      }),
      onQueryStarted({ habitID, values }, { dispatch }) {
        const patchResult = dispatch(
          habitApi.util.updateQueryData('getHabits', undefined, (draft) => {
            const habit = draft.find((habit) => habit._id == habitID);
            if (habit) {
              habit.name = values.name;
              habit.color = values.color;
              habit.description = values.description;
              habit.completed = values.completed;
              habit.elminiation = values.elimination;
            }
          }),
        );
      },
    }),
  }),
});

export const {
  useGetHabitsQuery,
  useGetHabitQuery,
  useCreateHabitMutation,
  useDeleteHabitMutation,
  useUpdateHabitMutation,
} = habitApi;
