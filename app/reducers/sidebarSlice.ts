import { createSlice } from '@reduxjs/toolkit';

type SidebarState = {
  sidebar: boolean;
};

const initialState: SidebarState = {
  sidebar: false,
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    openSidebar: (state) => {
      state.sidebar = true;
    },
    closeSidebar: (state) => {
      state.sidebar = false;
    },
  },
});

export const { openSidebar, closeSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
