import { isSameDay } from 'date-fns';
import api from './api';

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
      async onQueryStarted({ heatmapID, values }, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        const patchResult = dispatch(
          heatmapApi.util.updateQueryData('getHeatmaps', undefined, (draft) => {
            const Heatmap = draft.find((heatmap) => heatmap._id === heatmapID);
            const index = Heatmap.data.findIndex((point) =>
              isSameDay(new Date(point.date), new Date(values.date)) && !point.is_target,
            );
            const indexIsTarget = Heatmap.data.findIndex(
              (point) => isSameDay(new Date(point.date), new Date(values.date)) && point.is_target,
            );
            if (index !== -1 && !values?.is_target) {
              Heatmap.data = Heatmap.data.map((point) =>
                isSameDay(new Date(point.date), new Date(values.date))
                  ? { ...point, value: +point.value + 1 }
                  : point,
              );
            } else if (indexIsTarget !== -1 && values.is_target) {
              Heatmap.data = Heatmap.data.map((point) =>
                isSameDay(new Date(point.date), new Date(values.date)) && point.is_target
                  ? { ...point, value: values.value, period: values.period }
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
