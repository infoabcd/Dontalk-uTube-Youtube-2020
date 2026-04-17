import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getHistory = createAsyncThunk('history/getHistory', async () => {
  const res = await fetch('/api/history');
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
});

const historySlice = createSlice({
  name: 'history',
  initialState: {
    value: [],
    loading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getHistory.fulfilled, (state, action) => {
      state.value = action.payload;
      state.loading = false;
    });
  },
});

export default historySlice.reducer;
