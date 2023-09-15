import { isSameDay, compareDesc, startOfDay, endOfDay } from 'date-fns';
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
            const index = Heatmap.data.findIndex(
              (point) => isSameDay(new Date(point.date), new Date(values.date)) && !point.is_target,
            );
            const indexIsTarget = Heatmap.data.findIndex(
              (point) => isSameDay(new Date(point.date), new Date(values.date)) && point.is_target,
            );
            if (index !== -1 && !values?.is_target) {
              Heatmap.data = Heatmap.data.map((point) =>
                isSameDay(new Date(point.date), new Date(values.date)) && !point.is_target
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
    deleteCellPeriod: builder.mutation({
      query: ({ heatmapID, values }) => ({
        url: `heatmap/${heatmapID}`,
        body: values,
        method: 'DELETE',
      }),
      async onQueryStarted({ heatmapID, values }, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        const patchResult = dispatch(
          heatmapApi.util.updateQueryData('getHeatmaps', undefined, (draft) => {
            const Heatmap = draft.find((heatmap) => heatmap._id === heatmapID);
            Heatmap.data = Heatmap.data.filter(
              (point) =>
                compareDesc(new Date(point.date), startOfDay(new Date(values.dateStart))) > 0 ||
                compareDesc(endOfDay(new Date(values.dateEnd)), new Date(point.date)) > 0 ||
                point.is_target,
            );
          }),
        );
      },
    }),
            );
          }),
        );
      },
    }),
  }),
});

export const { useGetHeatmapsQuery, useUpdateHeatmapMutation, useDeleteCellPeriodMutation } =
  heatmapApi;
