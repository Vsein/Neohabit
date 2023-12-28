import api from './api';

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
        body: values,
        method: 'POST',
      }),
      async onQueryStarted(values, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        dispatch(
          projectApi.util.updateQueryData('getProjects', undefined, (draft) => {
            draft.push(res.data);
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
            const project = draft.find((projecto) => projecto._id == projectID);
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
            const index = draft.findIndex((project) => project._id === projectID);
            draft.splice(index, 1);
          }),
        );
      },
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
} = projectApi;
