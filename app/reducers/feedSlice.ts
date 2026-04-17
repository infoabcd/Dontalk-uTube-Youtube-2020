import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getFeed = createAsyncThunk('feed/getFeed', async () => {
  const res = await fetch('/api/videos');
  if (!res.ok) throw new Error('Failed to fetch feed');
  return res.json();
});

const feedSlice = createSlice({
  name: 'feed',
  initialState: {
    videos: [],
    loading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFeed.fulfilled, (state, action) => {
      state.videos = action.payload;
      state.loading = false;
    });
  },
});

export default feedSlice.reducer;
