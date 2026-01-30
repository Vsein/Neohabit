import { isSameSecond } from 'date-fns';
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
      async onQueryStarted({ habitID, values }, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        const newTarget = { ...values, id: res.data };
        const isAfterTarget = (target) =>
          areAscending(values.date_start, target.date_start) &&
          !isSameSecond(values.date_start, target.date_start);
        const addTargetToHabit = (habit) => {
          if (habit) {
            const i = findFirstIndexBsearch(habit.targets, isAfterTarget);
            if (i !== -1) {
              habit.targets.splice(i, 0, newTarget);
            } else {
              habit.targets.push(newTarget);
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
    deleteHabitTarget: builder.mutation({
      query: ({ habitTargetID }) => ({
        url: `habit_target/${habitTargetID}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ habitTargetID, habitID }, { dispatch, queryFulfilled }) {
        await queryFulfilled;

        const optimisticallyDeleteTarget = (habit) => {
          if (!habit) return;
          const index = habit.targets.findIndex((ht) => ht.id === habitTargetID);
          if (index !== -1) {
            habit.targets.splice(index, 1);
          }
        };

        dispatch(
          projectApi.util.updateQueryData('getProjects', undefined, (draft) => {
            draft.forEach((project) => {
              optimisticallyDeleteTarget(project.habits.find((h) => h.id === habitID));
            });
          }),
        );

        dispatch(
          habitApi.util.updateQueryData('getHabits', undefined, (draft) => {
            optimisticallyDeleteTarget(draft.find((h) => h.id === habitID));
          }),
        );

        dispatch(
          habitApi.util.updateQueryData('getHabitsOutsideProjects', undefined, (draft) => {
            optimisticallyDeleteTarget(draft.find((h) => h.id === habitID));
          }),
        );
      },
    }),
  }),
});

export const { useCreateHabitTargetMutation, useDeleteHabitTargetMutation } = habitTargetApi;
