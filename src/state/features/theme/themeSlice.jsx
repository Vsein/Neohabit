import { createSlice } from '@reduxjs/toolkit';

export const changeTheme = (newTheme) => {
  const root = document.documentElement;
  const link = document.querySelector("link[rel~='icon']");
  link.href = newTheme === 'dark' ? './logos/favicon-dark2.ico' : './logos/favicon.ico';
  root.className = newTheme;
};

const darkTheme = {
  rgb: { r: 36, g: 36, b: 36 },
  hex: '#242424',
};

const lightTheme = {
  rgb: { r: 239, g: 239, b: 239 },
  hex: '#EFEFEF',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    theme: 'dark',
    colorRgb: darkTheme.rgb,
    colorHex: darkTheme.hex,
  },
  reducers: {
    changeTo: (state, action) => ({
      ...state,
      theme: action.payload,
      colorRgb: action.payload === 'dark' ? darkTheme.rgb : lightTheme.rgb,
      colorHex: action.payload === 'dark' ? darkTheme.hex : lightTheme.hex,
    }),
  },
});

// Action creators are generated for each case reducer function
export const { changeTo } = themeSlice.actions;

export default themeSlice.reducer;
