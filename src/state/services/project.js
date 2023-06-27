import api from './api';
import { heatmapApi } from './heatmap';

export const projectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => ({
        url: 'projects',
      }),
    }),
    getProject: builder.query({
      query: (id) => ({
        url: `project/${id}`,
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
            draft.push(res.data.project);
          }),
        );
        dispatch(
          heatmapApi.util.updateQueryData('getHeatmaps', undefined, (draft) => {
            draft.push(res.data.heatmap);
          }),
        );
      },
    }),
    deleteProject: builder.mutation({
      query: (projectID) => ({
        url: `project/${projectID}`,
        method: 'DELETE',
      }),
      onQueryStarted(projectID, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          projectApi.util.updateQueryData('getProjects', undefined, (draft) => {
            const index = draft.findIndex(
              (project) => project._id == projectID,
            );
            draft.splice(index, 1);
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
            const project = draft.find((project) => project._id == projectID);
            if (project) {
              project.name = values.name;
              project.color = values.color;
              project.description = values.description;
              project.completed = values.completed;
            }
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
