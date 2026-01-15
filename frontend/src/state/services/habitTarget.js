import api from './api';
import { habitApi } from './habit';
import { projectApi } from './project';
import { findFirstIndexBsearch } from '../../utils/binarySearch';
import { areAscending } from '../../utils/dates';

export const habitTargetApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createHabitTarget: builder.mutation({
      query: ({ habitID, values }) => ({
        url: `habit/${habitID}/target`,
        body: values,
        method: 'POST',
      }),
      async onQueryStarted({ habitID, values }, { dispatch }) {
        const isAfterTarget = (target) => areAscending(values.date, target.date);
        const addTargetToHabit = (habit) => {
          if (habit) {
            const i = findFirstIndexBsearch(habit.data, isAfterTarget);
            if (i !== -1) {
              habit.targets.splice(i, 0, values);
            } else {
              habit.targets.push(values);
            }
          }
        };

        dispatch(
          projectApi.util.updateQueryData('getProjects', undefined, (draft) => {
            draft.forEach((project) => {
              addTargetToHabit(project.habits.find((h) => h.id === habitID));
            });
          }),
        );

        dispatch(
          habitApi.util.updateQueryData('getHabits', undefined, (draft) => {
            addTargetToHabit(draft.find((h) => h.id === habitID));
          }),
        );

        dispatch(
          habitApi.util.updateQueryData('getHabitsOutsideProjects', undefined, (draft) => {
            addTargetToHabit(draft.find((h) => h.id === habitID));
          }),
        );
      },
    }),
  }),
});

export const { useCreateHabitTargetMutation } = habitTargetApi;
