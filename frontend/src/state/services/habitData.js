import api from './api';
import { habitApi } from './habit';
import { projectApi } from './project';
import { findFirstIndexBsearch } from '../../utils/binarySearch';
import { areAscending } from '../../utils/dates';

export const habitDataApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createHabitDataPoint: builder.mutation({
      query: ({ habitID, values }) => ({
        url: `habit/${habitID}/data_point`,
        body: values,
        method: 'POST',
      }),
      async onQueryStarted({ habitID, values }, { dispatch }) {
        const isAfterDataPoint = (dataPoint) => areAscending(values.date, dataPoint.date);
        const addDataPointToHabit = (habit) => {
          if (habit) {
            const i = findFirstIndexBsearch(habit.data, isAfterDataPoint);
            if (i !== -1) {
              habit.data.splice(i, 0, values);
            } else {
              habit.data.push(values);
            }
          }
        };

        dispatch(
          projectApi.util.updateQueryData('getProjects', undefined, (draft) => {
            draft.forEach((project) => {
              addDataPointToHabit(project.habits.find((h) => h.id === habitID));
            });
          }),
        );

        dispatch(
          habitApi.util.updateQueryData('getHabits', undefined, (draft) => {
            addDataPointToHabit(draft.find((h) => h.id === habitID));
          }),
        );

        dispatch(
          habitApi.util.updateQueryData('getHabitsOutsideProjects', undefined, (draft) => {
            addDataPointToHabit(draft.find((h) => h.id === habitID));
          }),
        );
      },
    }),
  }),
});

export const { useCreateHabitDataPointMutation } = habitDataApi;
