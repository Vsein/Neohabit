import { createSlice } from '@reduxjs/toolkit';

const darkTheme = {
  rgb: { r: 28, g: 33, b: 40 },
  hex: '#1C2128',
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
