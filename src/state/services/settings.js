import api from './api';
import { changeTo, changeTheme } from '../features/theme/themeSlice';

export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => ({
        url: 'settings',
      }),
      async onQueryStarted(values, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        const newTheme = res.data.prefer_dark ? 'dark' : 'light';
        changeTheme(newTheme);
        dispatch(changeTo(newTheme));
      },
    }),
    getSelf: builder.query({
      query: () => ({
        url: 'user/im',
      }),
    }),
    deleteSelf: builder.mutation({
      query: () => ({
        url: 'user/im',
        method: 'DELETE',
      }),
    }),
    updateSettings: builder.mutation({
      query: ({ values }) => ({
        url: 'settings',
        body: values,
        method: 'PUT',
      }),
      async onQueryStarted({ values }, { dispatch }) {
        if (values.prefer_dark !== undefined) {
          const newTheme = values.prefer_dark ? 'dark' : 'light';
          changeTheme(newTheme);
        }
        dispatch(
          settingsApi.util.updateQueryData('getSettings', undefined, (draft) => {
            Object.assign(draft, values);
          }),
        );
      },
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useGetSelfQuery,
  useDeleteSelfMutation,
  useUpdateSettingsMutation,
} = settingsApi;
