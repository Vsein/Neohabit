import api from './api';

export const skilltreeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSkilltrees: builder.query({
      query: () => ({
        url: 'skilltrees',
      }),
    }),
    createSkilltree: builder.mutation({
      query: (values) => ({
        url: 'skilltree',
        body: values,
        method: 'POST',
      }),
      async onQueryStarted(values, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        dispatch(
          skilltreeApi.util.updateQueryData('getSkilltrees', undefined, (draft) => {
            draft.push(res.data);
          }),
        );
      },
    }),
    deleteSkilltree: builder.mutation({
      query: (skilltreeID) => ({
        url: `habit/${skilltreeID}`,
        method: 'DELETE',
      }),
      onQueryStarted(skilltreeID, { dispatch }) {
        const patchResult = dispatch(
          skilltreeApi.util.updateQueryData('getSkilltrees', undefined, (draft) => {
            const index = draft.findIndex((skilltree) => skilltree._id === skilltreeID);
            draft.splice(index, 1);
          }),
        );
      },
    }),
  }),
});

export const { useGetSkilltreesQuery, useCreateSkilltreeMutation, useDeleteSkilltreeMutation } =
  skilltreeApi;
