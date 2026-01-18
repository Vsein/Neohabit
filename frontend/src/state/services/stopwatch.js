import api from './api';
import { habitApi } from './habit';
import { projectApi } from './project';
import { findFirstIndexBsearch } from '../../utils/binarySearch';
import { areAscending } from '../../utils/dates';

export const stopwatchApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStopwatch: builder.query({
      query: () => ({
        url: 'stopwatch',
      }),
    }),
    updateStopwatch: builder.mutation({
      query: ({ values }) => ({
        url: 'stopwatch',
        body: values,
        method: 'PATCH',
      }),
      async onQueryStarted({ values }, { dispatch }) {
        dispatch(
          stopwatchApi.util.updateQueryData('getStopwatch', undefined, (draft) => {
            Object.assign(draft, values);
          }),
        );
      },
    }),
    finishStopwatch: builder.mutation({
      query: ({ values }) => ({
        url: 'stopwatch/finish',
        body: values,
        method: 'POST',
      }),
      async onQueryStarted({ values }, { dispatch }) {
        dispatch(
          stopwatchApi.util.updateQueryData('getStopwatch', undefined, (draft) => {
            const resettedValues = {
              is_paused: true,
              is_initiated: false,
              pause_duration: 0,
              duration: 0,
            };
            Object.assign(draft, resettedValues);
          }),
        );

        if (values.habit_id) {
          const isAfterDataPoint = (dataPoint) => areAscending(values.start_time, dataPoint.date);
          const addDataPointToHabit = (habit) => {
            if (habit) {
              const i = findFirstIndexBsearch(habit.data, isAfterDataPoint);
              const newDataPoint = { date: values.start_time, value: 1 };
              if (i !== -1) {
                habit.data.splice(i, 0, newDataPoint);
              } else {
                habit.data.push(newDataPoint);
              }
            }
          };

          dispatch(
            projectApi.util.updateQueryData('getProjects', undefined, (draft) => {
              draft.forEach((project) => {
                addDataPointToHabit(project.habits.find((h) => h.id === values.habit_id));
              });
            }),
          );

          dispatch(
            habitApi.util.updateQueryData('getHabits', undefined, (draft) => {
              addDataPointToHabit(draft.find((h) => h.id === values.habit_id));
            }),
          );

          dispatch(
            habitApi.util.updateQueryData('getHabitsOutsideProjects', undefined, (draft) => {
              addDataPointToHabit(draft.find((h) => h.id === values.habit_id));
            }),
          );
        }
      },
    }),
  }),
});

export const { useGetStopwatchQuery, useUpdateStopwatchMutation, useFinishStopwatchMutation } =
  stopwatchApi;
