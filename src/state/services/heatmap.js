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
    updateHeatmap: builder.mutation({
      query: ({ heatmapID, values }) => ({
        url: `heatmap/${heatmapID}`,
        body: values,
        method: 'PUT',
      }),
      onQueryStarted({ heatmapID, values }, { dispatch }) {
        const patchResult = dispatch(
          heatmapApi.util.updateQueryData('getHeatmaps', undefined, (draft) => {
            const Heatmap = draft.find((heatmap) => heatmap._id == heatmapID);
            console.log(values);
            if (Heatmap) {
              Heatmap.data.push(values);
              Heatmap.data.sort((a, b) => a.date - b.date );
            }
          }),
        );
      },
    }),
  }),
});

export const {
  useGetHeatmapsQuery,
  useUpdateHeatmapMutation,
} = heatmapApi;
