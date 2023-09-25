import { createSlice } from '@reduxjs/toolkit';

export const stopwatchFullscreenSlice = createSlice({
  name: 'stopwatchFullscreen',
  initialState: {
    isNew: true,
    isActive: false,
  },
  reducers: {
    close: (state) => ({
      ...state,
      isActive: false,
    }),
    open: (state) => ({
      ...state,
      isActive: true,
    }),
  },
});

// Action creators are generated for each case reducer function
export const { close, open } = stopwatchFullscreenSlice.actions;

export default stopwatchFullscreenSlice.reducer;
