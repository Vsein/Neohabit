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
        const newSkilltree = {
          ...values,
          id: res.data.skilltree_id,
          skills: [
            {
              id: res.data.skill_id,
              skilltree_id: res.data.skilltree_id,
              is_root_skill: true,
              name: values.name,
              status: 'completed',
            },
          ],
        };
        dispatch(
          skilltreeApi.util.updateQueryData('getSkilltrees', undefined, (draft) => {
            draft.push(newSkilltree);
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
            const skilltree = draft.find((s) => s.id === skilltreeID);
            if (skilltree) {
              Object.assign(skilltree, values);
            }
          }),
        );
      },
    }),
    addSkill: builder.mutation({
      query: (values) => ({
        url: 'skill',
        body: values,
        method: 'POST',
      }),
      async onQueryStarted(values, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        const patchResult = dispatch(
          skilltreeApi.util.updateQueryData('getSkilltrees', undefined, (draft) => {
            const skilltree = draft.find((s) => s.id === values.skilltree_id);
            if (skilltree) {
              const newSkill = { ...values, id: res.data, skills: [] };
              skilltree.skills.push(newSkill);
            }
          }),
        );
      },
    }),
    editSkill: builder.mutation({
      query: ({ skillID, values }) => ({
        url: `skill/${skillID}`,
        body: values,
        method: 'PUT',
      }),
      async onQueryStarted({ skillID, values }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          skilltreeApi.util.updateQueryData('getSkilltrees', undefined, (draft) => {
            const skilltree = draft.find((s) => s.id === values.skilltree_id);
            if (skilltree) {
              const { skills } = skilltree;
              const skill = skills.find((s) => s.id === skillID);
              Object.assign(skill, values);
            }
          }),
        );
      },
    }),
    deleteSkill: builder.mutation({
      query: ({ skillID, values }) => ({
        url: `skill/${skillID}`,
        body: values,
        method: 'DELETE',
      }),
      async onQueryStarted({ skillID, values }, { dispatch }) {
        const patchResult = dispatch(
          skilltreeApi.util.updateQueryData('getSkilltrees', undefined, (draft) => {
            const skilltree = draft.find((s) => s.id === values.skilltree_id);
            skilltree.skills = skilltree.skills.filter(
              (skill) => values.ids.findIndex((id) => skill.id === id) === -1,
            );
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
            const index = draft.findIndex((skilltree) => skilltree.id === skilltreeID);
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
  useEditSkillMutation,
  useDeleteSkillMutation,
  useDeleteSkilltreeMutation,
} = skilltreeApi;
