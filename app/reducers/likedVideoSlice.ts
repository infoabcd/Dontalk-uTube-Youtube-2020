import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getLikedVideo = createAsyncThunk('liked/getLikedVideo', async () => {
  const res = await fetch('/api/liked');
  if (!res.ok) throw new Error('Failed to fetch liked videos');
  return res.json();
});

const likedVideoSlice = createSlice({
  name: 'liked',
  initialState: {
    loading: true,
    videos: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLikedVideo.fulfilled, (state, action) => {
      state.loading = false;
      state.videos = action.payload;
    });
  },
});

export default likedVideoSlice.reducer;
