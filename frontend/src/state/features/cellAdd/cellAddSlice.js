import { createSlice } from '@reduxjs/toolkit';

export const cellAddSlice = createSlice({
  name: 'cellAdd',
  initialState: {
    habitID: '',
    isTarget: false,
    isActive: false,
  },
  reducers: {
    changeHabitTo: (state, action) => ({
      ...state,
      habitID: action.payload.habitID,
      isTarget: action.payload.isTarget,
      isActive: action.payload.isActive,
    }),
    close: (state) => ({
      ...state,
      isActive: false,
    }),
  },
});

// Action creators are generated for each case reducer function
export const { changeHabitTo, close } = cellAddSlice.actions;

export default cellAddSlice.reducer;
