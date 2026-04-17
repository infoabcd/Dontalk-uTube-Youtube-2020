import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getSubscriptions = createAsyncThunk(
  'subscriptions/getSubscriptions',
  async () => {
    const res = await fetch('/api/subscriptions');
    if (!res.ok) throw new Error('Failed to fetch subscriptions');
    return res.json();
  }
);

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState: {
    videos: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSubscriptions.fulfilled, (state, action) => {
      state.videos = action.payload;
      state.loading = false;
    });
  },
});

export default subscriptionsSlice.reducer;
