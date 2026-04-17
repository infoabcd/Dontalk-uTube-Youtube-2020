import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const checkAuth = createAsyncThunk('userdetail/checkAuth', async () => {
  const res = await fetch('/api/auth/me');
  if (!res.ok) return null;
  const data = await res.json();
  return data.user;
});

const userdetailSlice = createSlice({
  name: 'userdetail',
  initialState: {
    profile: null as any,
    loading: true,
  },
  reducers: {
    signIn: (state, action) => {
      state.profile = action.payload.profile;
      state.loading = false;
    },
    signOut: (state) => {
      state.profile = null;
      state.loading = false;
    },
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload.profile };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.profile = action.payload;
      state.loading = false;
    });
    builder.addCase(checkAuth.rejected, (state) => {
      // 網路錯誤時保留既有 profile，避免短暫失敗造成畫面被登出
      state.loading = false;
    });
  },
});

export const { signIn, signOut, updateProfile } = userdetailSlice.actions;

export default userdetailSlice.reducer;
