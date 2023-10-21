import { createSlice } from '@reduxjs/toolkit';

export const overlaySlice = createSlice({
  name: 'overlay',
  initialState: {
    type: '',
    isActive: false,
    taskID: '',
    habitID: '',
    projectID: '',
    skilltreeID: '',
    skillID: '',
    skillparentID: '',
  },
  reducers: {
    changeTo: (state, action) => ({
      ...state,
      isActive: true,
      type: action.payload.type,
      taskID: action.payload?.taskID || '',
      habitID: action.payload?.habitID || '',
      projectID: action.payload?.projectID || '',
      skilltreeID: action.payload?.skilltreeID || '',
      skillID: action.payload?.skillID || '',
      skillparentID: action.payload?.skillparentID || '',
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
export const { changeTo, close, open } = overlaySlice.actions;

export default overlaySlice.reducer;
