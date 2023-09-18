import api from './api';
import { heatmapApi } from './heatmap';

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
              project.name = values.name;
              project.color = values.color;
              project.description = values.description;
              project.habits = values.habits;
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
