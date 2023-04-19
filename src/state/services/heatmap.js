import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { current } from '@reduxjs/toolkit';

export const heatmapApi = createApi({
  reducerPath: 'heatmapApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:9000/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getHeatmaps: builder.query({
      query: () => ({
        url: 'heatmaps',
      }),
    }),
  }),
});

export const {
  useGetHeatmapsQuery,
} = heatmapApi;
