import { createSlice } from '@reduxjs/toolkit';

export const habitOverlaySlice = createSlice({
  name: 'habitOverlay',
  initialState: {
    isNew: true,
    isActive: false,
    habitID: '',
  },
  reducers: {
    changeTo: (state, action) => ({
      ...state,
      isNew: false,
      isActive: true,
      habitID: action.payload,
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
export const { changeTo, close, open } = habitOverlaySlice.actions;

export default habitOverlaySlice.reducer;
