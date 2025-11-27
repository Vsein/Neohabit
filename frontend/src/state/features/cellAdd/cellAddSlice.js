import { createSlice } from '@reduxjs/toolkit';

export const cellAddSlice = createSlice({
  name: 'cellAdd',
  initialState: {
    heatmapID: '',
    isTarget: false,
    isActive: false,
  },
  reducers: {
    changeHeatmapTo: (state, action) => ({
      ...state,
      heatmapID: action.payload.heatmapID,
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
export const { changeHeatmapTo, close } = cellAddSlice.actions;

export default cellAddSlice.reducer;
