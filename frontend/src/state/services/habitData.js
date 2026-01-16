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
    reduceHabitDataPointsBetweenDatesByAmount: builder.mutation({
      query: ({ habitID, values }) => ({
        url: `habit/${habitID}/data_points/reduce_period`,
        body: values,
        method: 'POST',
      }),
      async onQueryStarted({ habitID, values }, { dispatch }) {
        const isAfterPeriodStart = (dataPoint) => areAscending(values.period_start, dataPoint.date);
        const isAfterPeriodEnd = (dataPoint) => areAscending(values.period_end, dataPoint.date);
        const reduceDataPointsBetweenDatesByAmount = (habit) => {
          if (habit) {
            const i = findFirstIndexBsearch(habit.data, isAfterPeriodStart);
            const j = findFirstIndexBsearch(habit.data, isAfterPeriodEnd);
            let remainingAmount = values.amount;
            if (i !== -1) {
              for (let k = i; k <= (j !== -1 ? j : habit.data.length - 1); k += 1) {
                const d = habit.data[k];
                if (d.value <= remainingAmount) {
                  remainingAmount -= d.value;
                  d.value = 0;
                } else {
                  d.value -= remainingAmount;
                  remainingAmount = 0;
                }
              }
            }
          }
        };

        dispatch(
          projectApi.util.updateQueryData('getProjects', undefined, (draft) => {
            draft.forEach((project) => {
              reduceDataPointsBetweenDatesByAmount(project.habits.find((h) => h.id === habitID));
            });
          }),
        );

        dispatch(
          habitApi.util.updateQueryData('getHabits', undefined, (draft) => {
            reduceDataPointsBetweenDatesByAmount(draft.find((h) => h.id === habitID));
          }),
        );

        dispatch(
          habitApi.util.updateQueryData('getHabitsOutsideProjects', undefined, (draft) => {
            reduceDataPointsBetweenDatesByAmount(draft.find((h) => h.id === habitID));
          }),
        );
      },
    }),
    deleteAllHabitDataPointsBetweenDates: builder.mutation({
      query: ({ habitID, values }) => ({
        url: `habit/${habitID}/data_points/delete_period`,
        body: values,
        method: 'DELETE',
      }),
      async onQueryStarted({ habitID, values }, { dispatch }) {
        const isAfterPeriodStart = (dataPoint) => areAscending(values.period_start, dataPoint.date);
        const isAfterPeriodEnd = (dataPoint) => areAscending(values.period_end, dataPoint.date);
        const deleteAllDataPointsBetweenDates = (habit) => {
          if (habit) {
            const i = findFirstIndexBsearch(habit.data, isAfterPeriodStart);
            const j = findFirstIndexBsearch(habit.data, isAfterPeriodEnd);
            if (i !== -1) {
              if (j !== -1) {
                habit.data.splice(i, j - i);
              } else {
                habit.data.splice(i);
              }
            }
          }
        };

        dispatch(
          projectApi.util.updateQueryData('getProjects', undefined, (draft) => {
            draft.forEach((project) => {
              deleteAllDataPointsBetweenDates(project.habits.find((h) => h.id === habitID));
            });
          }),
        );

        dispatch(
          habitApi.util.updateQueryData('getHabits', undefined, (draft) => {
            deleteAllDataPointsBetweenDates(draft.find((h) => h.id === habitID));
          }),
        );

        dispatch(
          habitApi.util.updateQueryData('getHabitsOutsideProjects', undefined, (draft) => {
            deleteAllDataPointsBetweenDates(draft.find((h) => h.id === habitID));
          }),
        );
      },
    }),
  }),
});

export const {
  useCreateHabitDataPointMutation,
  useDeleteAllHabitDataPointsBetweenDatesMutation,
  useReduceHabitDataPointsBetweenDatesByAmountMutation,
} = habitDataApi;
