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
