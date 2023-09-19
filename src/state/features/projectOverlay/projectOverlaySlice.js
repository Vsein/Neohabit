import { createSlice } from '@reduxjs/toolkit';

export const projectOverlaySlice = createSlice({
  name: 'projectOverlay',
  initialState: {
    isNew: true,
    isActive: false,
    projectID: '',
  },
  reducers: {
    changeTo: (state, action) => ({
      ...state,
      isNew: false,
      isActive: true,
      projectID: action.payload,
    }),
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
export const { changeTo, close, open } = projectOverlaySlice.actions;

export default projectOverlaySlice.reducer;
