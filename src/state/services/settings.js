import api from './api';
import { changeTo } from '../features/theme/themeSlice';

const changeTheme = (newTheme) => {
  const root = document.documentElement;
  const link = document.querySelector("link[rel~='icon']");
  link.href =
    newTheme === 'dark' ? './logos/favicon-dark2.ico' : './logos/favicon.ico';
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
        dispatch(changeTo(newTheme));
      },
    }),
    changeTheme: builder.mutation({
      query: (preferDark) => ({
        url: 'settings/theme',
        body: { preferDark },
        method: 'PUT',
      }),
      async onQueryStarted(preferDark, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        const newTheme = preferDark ? 'dark' : 'light';
        changeTheme(newTheme);
        dispatch(changeTo(newTheme));
        dispatch(
          settingsApi.util.updateQueryData(
            'getSettings',
            undefined,
            (draft) => {
              draft.prefer_dark = preferDark;
            },
          ),
        );
      },
    }),
  }),
});

export const { useGetSettingsQuery, useChangeThemeMutation } = settingsApi;
