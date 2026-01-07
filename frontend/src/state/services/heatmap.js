import { isSameDay, compareDesc, startOfDay, endOfDay } from 'date-fns';
import api from './api';
import newId from '../../utils/newId';

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
      async onQueryStarted({ heatmapID, values }, { dispatch }) {
        const patchResult = dispatch(
          heatmapApi.util.updateQueryData('getHeatmaps', undefined, (draft) => {
            const Heatmap = draft.find((heatmap) => heatmap.id === heatmapID);
            const index = Heatmap.data.findIndex(
              (point) => isSameDay(new Date(point.date), new Date(values.date)) && !point.is_target,
            );
            const indexIsTarget = Heatmap.data.findIndex(
              (point) => isSameDay(new Date(point.date), new Date(values.date)) && point.is_target,
            );
            if (index !== -1 && !values?.is_target) {
              Heatmap.data = Heatmap.data.map((point) =>
                isSameDay(new Date(point.date), new Date(values.date)) && !point.is_target
                  ? { ...point, value: +point.value + +values.value }
                  : point,
              );
            } else if (indexIsTarget !== -1 && values.is_target) {
              Heatmap.data = Heatmap.data.map((point) =>
                isSameDay(new Date(point.date), new Date(values.date)) && point.is_target
                  ? {
                      ...point,
                      value: +values.value,
                      period: values.period,
                      is_archive: +values.value === 0 && values.is_target,
                    }
                  : point,
              );
            } else {
              Heatmap.data.push({ ...values, value: +values.value, _id: newId() });
            }
            Heatmap.data.sort((a, b) => a.date - b.date);
          }),
        );
      },
    }),
    decreaseCellPeriod: builder.mutation({
      query: ({ heatmapID, values }) => ({
        url: `heatmap/${heatmapID}`,
        body: values,
        method: 'POST',
      }),
      async onQueryStarted({ heatmapID, values }, { dispatch }) {
        const patchResult = dispatch(
          heatmapApi.util.updateQueryData('getHeatmaps', undefined, (draft) => {
            const Heatmap = draft.find((heatmap) => heatmap.id === heatmapID);
            const zeroPoints = Heatmap.data.filter(
              (point) =>
                compareDesc(startOfDay(new Date(values.dateStart)), new Date(point.date)) > 0 &&
                compareDesc(new Date(point.date), endOfDay(new Date(values.dateEnd))) > 0 &&
                !point.is_target &&
                point.value > 0,
            );
            const points = zeroPoints.filter((point) => point.value > 1);
            if (points.length) {
              Heatmap.data = Heatmap.data.map((point) =>
                point.id === points[0].id && !point.is_target
                  ? { ...point, value: +point.value - 1 }
                  : point,
              );
            } else if (zeroPoints.length) {
              Heatmap.data = Heatmap.data.filter(
                (point) => !(point.id === zeroPoints[0].id) || point.is_target,
              );
            }
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
      async onQueryStarted({ heatmapID, values }, { dispatch }) {
        const patchResult = dispatch(
          heatmapApi.util.updateQueryData('getHeatmaps', undefined, (draft) => {
            const Heatmap = draft.find((heatmap) => heatmap.id === heatmapID);
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
  }),
});

export const {
  useGetHeatmapsQuery,
  useUpdateHeatmapMutation,
  useDecreaseCellPeriodMutation,
  useDeleteCellPeriodMutation,
} = heatmapApi;
