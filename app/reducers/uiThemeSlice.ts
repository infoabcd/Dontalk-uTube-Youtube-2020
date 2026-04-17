import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "utube-theme";

type UiThemeState = {
  mode: ThemeMode;
};

const initialState: UiThemeState = {
  mode: "light",
};

const uiThemeSlice = createSlice({
  name: "uiTheme",
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
    toggleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
    },
    hydrateThemeFromStorage: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
  },
});

export const { setThemeMode, toggleTheme, hydrateThemeFromStorage } =
  uiThemeSlice.actions;

export { STORAGE_KEY as THEME_STORAGE_KEY };

export default uiThemeSlice.reducer;
