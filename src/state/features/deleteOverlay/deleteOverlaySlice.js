import { createSlice } from '@reduxjs/toolkit';

export const deleteOverlaySlice = createSlice({
  name: 'deleteOverlay',
  initialState: {
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
export const { close, open } = deleteOverlaySlice.actions;

export default deleteOverlaySlice.reducer;
