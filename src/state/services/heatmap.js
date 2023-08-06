import api from './api';
import { isSameDay } from 'date-fns';

export const heatmapApi = api.injectEndpoints({
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
      async onQueryStarted(
        { heatmapID, values },
        { dispatch, queryFulfilled },
      ) {
        const res = await queryFulfilled;
        const patchResult = dispatch(
          heatmapApi.util.updateQueryData('getHeatmaps', undefined, (draft) => {
            const Heatmap = draft.find((heatmap) => heatmap._id == heatmapID);
            const index = Heatmap.data.findIndex((point) =>
              isSameDay(new Date(point.date), new Date(values.date)),
            );
            if (index != -1 && !values?.is_target) {
              Heatmap.data = Heatmap.data.map((point) =>
                isSameDay(new Date(point.date), new Date(values.date))
                  ? { ...point, value: point.value + 1 }
                  : point,
              );
            } else {
              Heatmap.data.push(values);
            }
            Heatmap.data.sort((a, b) => a.date - b.date);
          }),
        );
      },
    }),
  }),
});

export const { useGetHeatmapsQuery, useUpdateHeatmapMutation } = heatmapApi;
