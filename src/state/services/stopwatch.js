import { isSameDay, startOfDay } from 'date-fns';
import api from './api';
import { heatmapApi } from './heatmap';

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
        method: 'PUT',
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
        dispatch(
          heatmapApi.util.updateQueryData('getHeatmaps', undefined, (draft) => {
            const Heatmap = draft.find((heatmap) => heatmap.habit._id == values.habit._id);
            const index = Heatmap.data.findIndex(
              (point) =>
                isSameDay(new Date(point.date), new Date(values.start_time)) && !point.is_target,
            );
            if (index !== -1) {
              Heatmap.data = Heatmap.data.map((point) =>
                isSameDay(new Date(point.date), new Date(values.start_time)) && !point.is_target
                  ? { ...point, value: +point.value + +1 }
                  : point,
              );
            } else {
              Heatmap.data.push({ date: startOfDay(new Date(values.start_time)), value: 1 });
            }
            Heatmap.data.sort((a, b) => a.date - b.date);
          }),
        );
      },
    }),
  }),
});

export const { useGetStopwatchQuery, useUpdateStopwatchMutation, useFinishStopwatchMutation } =
  stopwatchApi;
