import api from './api';

const changeTheme = (newTheme) => {
  const root = document.documentElement;
  const link = document.querySelector("link[rel~='icon']");
  link.href = newTheme === 'dark' ? '/favicon-dark2.ico' : '/favicon.ico';
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute('content', newTheme === 'dark' ? '#1c2128' : '#00c4cd');
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
        changeTheme(res.data.theme);
      },
    }),
    getSelf: builder.query({
      query: () => ({
        url: 'user',
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
    requestVerificationEmail: builder.mutation({
      query: () => ({
        url: 'verification/resend',
        method: 'PUT',
      }),
      async onQueryStarted(values, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        dispatch(
          settingsApi.util.updateQueryData('getSelf', undefined, (draft) => {
            Object.assign(draft, { registration_time: Date.now() });
          }),
        );
      },
    }),
    deleteSelf: builder.mutation({
      query: () => ({
        url: 'user',
        method: 'DELETE',
      }),
    }),
    updateSettings: builder.mutation({
      query: ({ values }) => ({
        url: 'settings',
        body: values,
        method: 'PATCH',
      }),
      async onQueryStarted({ values }, { dispatch }) {
        if (values.theme !== undefined) {
          changeTheme(values.theme);
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
  useRequestVerificationEmailMutation,
  useDeleteSelfMutation,
  useUpdateSettingsMutation,
} = settingsApi;
