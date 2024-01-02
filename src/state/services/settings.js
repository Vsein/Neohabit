import api from './api';

const changeTheme = (newTheme) => {
  const root = document.documentElement;
  const link = document.querySelector("link[rel~='icon']");
  link.href = newTheme === 'dark' ? './logos/favicon-dark2.ico' : './logos/favicon.ico';
  root.className = newTheme;
};

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
        // dispatch(changeTo(newTheme));
      },
    }),
    getSelf: builder.query({
      query: () => ({
        url: 'user/im',
      }),
    }),
    getVerified: builder.query({
      query: ({ token }) => ({
        url: `verification/${token}`,
      }),
      async onQueryStarted(values, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        console.log(res.data);
        if (res.data === 'User verified') {
          dispatch(
            settingsApi.util.updateQueryData('getSelf', undefined, (draft) => {
              Object.assign(draft, { verified: true });
            }),
          );
        }
      },
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
  useGetVerifiedQuery,
  useDeleteSelfMutation,
  useUpdateSettingsMutation,
} = settingsApi;
