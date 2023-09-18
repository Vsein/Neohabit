import { createSlice } from '@reduxjs/toolkit';

export const taskOverlaySlice = createSlice({
  name: 'taskOverlay',
  initialState: {
    isNew: true,
    isActive: false,
    taskID: '',
    habitID: '',
  },
  reducers: {
    changeTo: (state, action) => ({
      ...state,
      isNew: false,
      isActive: true,
      taskID: action.payload.taskID,
      habitID: action.payload.habitID,
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
export const { changeTo, close, open } = taskOverlaySlice.actions;

export default taskOverlaySlice.reducer;
