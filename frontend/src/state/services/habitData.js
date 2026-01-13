import api from './api';

export const habitDataApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createHabitDataPoint: builder.mutation({
      query: ({ habitID, values }) => ({
        url: `habit/${habitID}/data_point`,
        body: values,
        method: 'POST',
      }),
    }),
  }),
});

export const { useCreateHabitDataPointMutation } = habitDataApi;
