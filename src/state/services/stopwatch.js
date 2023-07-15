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
      async onQueryStarted({ values }, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        const patchResult = dispatch(
          stopwatchApi.util.updateQueryData(
            'getStopwatch',
            undefined,
            (draft) => {
              Object.assign(draft, values);
            },
          ),
        );
      },
    }),
    finishStopwatch: builder.mutation({
      query: ({ values }) => ({
        url: 'stopwatch/finish',
        body: values,
        method: 'POST',
      }),
      async onQueryStarted({ values }, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        const patchResult = dispatch(
          stopwatchApi.util.updateQueryData(
            'getStopwatch',
            undefined,
            (draft) => {
              const resettedValues = {
                is_paused: true,
                is_initiated: false,
                pause_duration: 0,
                duration: 0,
              };
              Object.assign(draft, resettedValues);
            },
          ),
        );
        dispatch(
          heatmapApi.util.updateQueryData('getHeatmaps', undefined, (draft) => {
            const Heatmap = draft.find((heatmap) => heatmap.project._id == values.project._id);
            if (Heatmap) {
              Heatmap.data.push(res.data);
              Heatmap.data.sort((a, b) => a.date - b.date);
            }
          }),
        );
      },
    }),
  }),
});

export const {
  useGetStopwatchQuery,
  useUpdateStopwatchMutation,
  useFinishStopwatchMutation,
} = stopwatchApi;
