import { createSlice } from '@reduxjs/toolkit';

type MenuState = {
  open: boolean;
};

const initialState: MenuState = {
  open: false,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    openMenu: (state) => {
      state.open = true;
    },
    closeMenu: (state) => {
      state.open = false;
    },
  },
});

export const { openMenu, closeMenu } = menuSlice.actions;
export default menuSlice.reducer;
