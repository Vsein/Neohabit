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
    updateSkilltree: builder.mutation({
      query: ({ skilltreeID, values }) => ({
        url: `skilltree/${skilltreeID}`,
        body: values,
        method: 'PUT',
      }),
      onQueryStarted({ skilltreeID, values }, { dispatch }) {
        const patchResult = dispatch(
          skilltreeApi.util.updateQueryData('getSkilltrees', undefined, (draft) => {
            const skilltree = draft.find((skilltreo) => skilltreo._id == skilltreeID);
            if (skilltree) {
              skilltree.name = values.name;
              skilltree.color = values.color;
            }
          }),
        );
      },
    }),
    addSkill: builder.mutation({
      query: ({ skilltreeID, skillparentID, values }) => ({
        url: `skilltree/${skilltreeID}/${skillparentID}`,
        body: values,
        method: 'POST',
      }),
      async onQueryStarted({ skilltreeID, skillparentID, values }, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        const patchResult = dispatch(
          skilltreeApi.util.updateQueryData('getSkilltrees', undefined, (draft) => {
            const skilltree = draft.find((skilltreo) => skilltreo._id == skilltreeID);
            if (skilltree) {
              const { skills } = skilltree;
              skills.push(res.data);
            }
          }),
        );
      },
    }),
    deleteSkilltree: builder.mutation({
      query: (skilltreeID) => ({
        url: `skilltree/${skilltreeID}`,
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

export const {
  useGetSkilltreesQuery,
  useCreateSkilltreeMutation,
  useUpdateSkilltreeMutation,
  useAddSkillMutation,
  useDeleteSkilltreeMutation,
} = skilltreeApi;
