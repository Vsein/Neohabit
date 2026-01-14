import api from './api';
import { projectApi } from './project';

export const habitApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHabits: builder.query({
      query: () => ({
        url: 'habits',
      }),
    }),
    getHabitsOutsideProjects: builder.query({
      query: () => ({
        url: 'habits/outside_projects',
      }),
      providesTags: ['HabitsOutsideProjects'],
    }),
    // getHabit: builder.query({
    //   query: (id) => ({
    //     url: `habit/${id}`,
    //   }),
    // }),
    createHabit: builder.mutation({
      query: (values) => ({
        url: 'habit',
        body: values,
        method: 'POST',
      }),
      async onQueryStarted(values, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        const newHabit = { ...values, id: res.data, data: [], targets: [], created_at: new Date() };
        dispatch(
          habitApi.util.updateQueryData('getHabits', undefined, (draft) => {
            draft.push(newHabit);
          }),
        );
        if (!values.project_id) {
          dispatch(
            habitApi.util.updateQueryData('getHabitsOutsideProjects', undefined, (draft) => {
              draft.push(newHabit);
            }),
          );
        } else {
          dispatch(
            projectApi.util.updateQueryData('getProjects', undefined, (draft) => {
              const project = draft.find((p) => p.id === values.project_id);
              if (project) {
                project.habits.push(newHabit);
              }
            }),
          );
        }
      },
    }),
    deleteHabit: builder.mutation({
      query: (habitID) => ({
        url: `habit/${habitID}`,
        method: 'DELETE',
      }),
      async onQueryStarted(habitID, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        const optimisticallyDelete = (habits) => {
          const index = habits.findIndex((h) => h.id === habitID);
          if (index !== -1) {
            habits.splice(index, 1);
          }
        };

        dispatch(
          habitApi.util.updateQueryData('getHabits', undefined, (draft) => {
            optimisticallyDelete(draft);
          }),
        );

        dispatch(
          habitApi.util.updateQueryData('getHabitsOutsideProjects', undefined, (draft) => {
            optimisticallyDelete(draft);
          }),
        );

        dispatch(
          projectApi.util.updateQueryData('getProjects', undefined, (draft) => {
            draft.forEach((p) => optimisticallyDelete(p.habits));
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
        const optimisticallyUpdate = (habit) => habit && Object.assign(habit, values);

        dispatch(
          projectApi.util.updateQueryData('getProjects', undefined, (draft) => {
            draft.forEach((p) => {
              optimisticallyUpdate(p.habits.find((h) => h.id === habitID));
            });
          }),
        );

        dispatch(
          habitApi.util.updateQueryData('getHabits', undefined, (draft) => {
            optimisticallyUpdate(draft.find((h) => h.id === habitID));
          }),
        );

        dispatch(
          habitApi.util.updateQueryData('getHabitsOutsideProjects', undefined, (draft) => {
            optimisticallyUpdate(draft.find((h) => h.id === habitID));
          }),
        );
      },
    }),
  }),
});

export const {
  useGetHabitsQuery,
  useGetHabitsOutsideProjectsQuery,
  // useGetHabitQuery,
  useCreateHabitMutation,
  useDeleteHabitMutation,
  useUpdateHabitMutation,
} = habitApi;
