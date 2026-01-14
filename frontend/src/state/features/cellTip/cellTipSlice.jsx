import { createSlice } from '@reduxjs/toolkit';

export const cellTipSlice = createSlice({
  name: 'cellAdd',
  initialState: {
    habitID: '',
    dateStart: '',
    dateEnd: '',
    actions: 0,
  },
  reducers: {
    changeCellPeriodTo: (state, action) => ({
      ...state,
      habitID: action.payload.habitID,
      dateStart: action.payload.dateStart,
      dateEnd: action.payload.dateEnd,
      actions: action.payload.actions,
    }),
    changeCellActions: (state, action) => ({
      ...state,
      actions: action.payload.actions,
    }),
  },
});

// Action creators are generated for each case reducer function
export const { changeCellPeriodTo, changeCellActions } = cellTipSlice.actions;

export default cellTipSlice.reducer;
