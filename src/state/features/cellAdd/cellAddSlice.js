import { createSlice } from '@reduxjs/toolkit';

export const cellAddSlice = createSlice({
  name: 'cellAdd',
  initialState: {
    heatmapID: '',
    isTarget: false,
  },
  reducers: {
    changeHeatmapTo: (state, action) => ({
      ...state,
      heatmapID: action.payload.heatmapID,
      isTarget: action.payload.isTarget,
    }),
  },
});

// Action creators are generated for each case reducer function
export const { changeHeatmapTo } = cellAddSlice.actions

export default cellAddSlice.reducer
