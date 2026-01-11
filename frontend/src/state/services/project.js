import api from './api';
import { habitApi } from './habit';
import filterInPlace from '../../utils/filterInPlace';

export const projectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => ({
        url: 'projects',
      }),
    }),
    createProject: builder.mutation({
      query: (values) => ({
        url: 'project',
        body: { ...values, habits: undefined },
        method: 'POST',
      }),
      async onQueryStarted(values, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        dispatch(
          projectApi.util.updateQueryData('getProjects', undefined, (draft) => {
            draft.push({ id: res.data, order_index: draft.length, ...values });
          }),
        );
        dispatch(
          habitApi.util.updateQueryData('getHabitsOutsideProjects', undefined, (draft) => {
            filterInPlace(draft, (h) => !values.habit_ids.includes(h.id));
          }),
        );
      },
    }),
    updateProject: builder.mutation({
      query: ({ projectID, values }) => ({
        url: `project/${projectID}`,
        body: values,
        method: 'PUT',
      }),
      onQueryStarted({ projectID, values }, { dispatch }) {
        const patchResult = dispatch(
          projectApi.util.updateQueryData('getProjects', undefined, (draft) => {
            const project = draft.find((p) => p.id === projectID);
            if (project) {
              Object.assign(project, values);
            }
          }),
        );
      },
    }),
    deleteProject: builder.mutation({
      query: (projectID) => ({
        url: `project/${projectID}`,
        method: 'DELETE',
      }),
      onQueryStarted(projectID, { dispatch }) {
        const patchResult = dispatch(
          projectApi.util.updateQueryData('getProjects', undefined, (draft) => {
            const index = draft.findIndex((p) => p.id === projectID);
            draft.splice(index, 1);
          }),
        );
      },
    }),
  }),
});

export const {
  useGetProjectsQuery,
  // useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;
