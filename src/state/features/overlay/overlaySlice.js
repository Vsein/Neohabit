import { createSlice } from '@reduxjs/toolkit';

export const overlaySlice = createSlice({
  name: 'overlay',
  initialState: {
    isNew: true,
    isActive: false,
    ID: '',
  },
  reducers: {
    changeTo: (state, action) => ({
      ...state,
      isNew: false,
      isActive: true,
      ID: action.payload,
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
export const { changeTo, close, open } = overlaySlice.actions

export default overlaySlice.reducer
