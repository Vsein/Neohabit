import api from './api';
import { heatmapApi } from './heatmap';
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
        const newHabit = { id: res.data, ...values };
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
      async onQueryStarted(habitID, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        dispatch(
          habitApi.util.updateQueryData('getHabits', undefined, (draft) => {
            const index = draft.findIndex((habit) => habit.id === habitID);
            draft.splice(index, 1);
          }),
        );
        dispatch(
          projectApi.util.updateQueryData('getProjects', undefined, (draft) => {
            const Projects = draft.filter((project) => project.habits.includes(habitID));
            Projects.forEach((Project) => {
              Project.habits = Project.habits.filter((ID) => ID !== habitID);
            });
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
            const habit = draft.find((h) => h.id === habitID);
            if (habit) {
              Object.assign(habit, values);
            }
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
