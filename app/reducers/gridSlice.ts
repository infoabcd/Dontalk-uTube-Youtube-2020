import { createSlice } from '@reduxjs/toolkit';

const gridSlice = createSlice({
  name: 'grid',
  initialState: {
    width: 0,
  },
  reducers: {
    setWidth: (state, action: { payload: number }) => {
      state.width = action.payload;
    },
  },
});

export const { setWidth } = gridSlice.actions;

export default gridSlice.reducer;
