import { createSlice } from '@reduxjs/toolkit';

export const cellAddSlice = createSlice({
  name: 'cellAdd',
  initialState: {
    heatmapID: '',
  },
  reducers: {
    changeHeatmapTo: (state, action) => ({
      ...state,
      heatmapID: action.payload,
    }),
  },
});

// Action creators are generated for each case reducer function
export const { changeHeatmapTo } = cellAddSlice.actions

export default cellAddSlice.reducer
