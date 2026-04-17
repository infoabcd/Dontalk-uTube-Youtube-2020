import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getChannel = createAsyncThunk('channel/getChannel', async (uid: string) => {
  const res = await fetch(`/api/channels/${uid}`);
  if (!res.ok) throw new Error('Failed to fetch channels');
  return res.json();
});

type ChannelRow = {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
};

const channelSlice = createSlice({
  name: 'channel',
  initialState: {
    loading: true,
    channels: [] as ChannelRow[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getChannel.fulfilled, (state, action) => {
      state.channels = action.payload;
      state.loading = false;
    });
  },
});

export default channelSlice.reducer;
