import api from './api';

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
          stopwatchApi.util.updateQueryData('getStopwatch', undefined, (draft) => {
            Object.assign(draft, values);
          }),
        );
      },
    }),
  }),
});

export const { useGetStopwatchQuery, useUpdateStopwatchMutation } =
  stopwatchApi;
