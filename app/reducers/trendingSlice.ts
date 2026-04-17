import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getTrending = createAsyncThunk('trending/getTrending', async () => {
  const res = await fetch('/api/videos/trending');
  if (!res.ok) throw new Error('Failed to fetch trending');
  return res.json();
});

const trendingSlice = createSlice({
  name: 'trending',
  initialState: {
    videos: [],
    loading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTrending.fulfilled, (state, action) => {
      state.videos = action.payload;
      state.loading = false;
    });
  },
});

export default trendingSlice.reducer;
