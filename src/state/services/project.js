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
    dragHabitInProject: builder.mutation({
      query: ({ projectID, values }) => ({
        url: `project/drag_habit/${projectID}`,
        body: values,
        method: 'POST',
      }),
      onQueryStarted({ projectID, values }, { dispatch }) {
        const patchResult = dispatch(
          projectApi.util.updateQueryData('getProjects', undefined, (draft) => {
            const project = draft.find((projecto) => projecto._id === projectID);
            if (project && project.habits) {
              console.log([...project.habits]);
              const draggedHabitPosition = project.habits.findIndex(
                (habit) => habit === values.draggedHabitID,
              );
              console.log(draggedHabitPosition);
              project.habits.splice(draggedHabitPosition, 1);
              console.log([...project.habits]);
              const position = project.habits.findIndex((habit) => habit === values.targetHabitID);
              console.log(position);
              project.habits.splice(position + values.insertAfter, 0, values.draggedHabitID);
              console.log([...project.habits]);
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
  useDragHabitInProjectMutation,
} = projectApi;
