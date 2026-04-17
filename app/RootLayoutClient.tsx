"use client";

import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import store from "./store";
import { light, dark } from "./styled/themes";
import GlobalStyle from "./styled/GlobalStyle";
import { checkAuth } from "./reducers/userdetailSlice";
import {
  hydrateThemeFromStorage,
  THEME_STORAGE_KEY,
} from "./reducers/uiThemeSlice";
import type { RootState } from "./store";
import SiteFooter from "./components/SiteFooter";

try {
  TimeAgo.addDefaultLocale(en);
} catch {
  // locale already added
}

function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth() as any);
  }, [dispatch]);
  return <>{children}</>;
}

function ThemeRoot({ children }: { children: React.ReactNode }) {
  const mode = useSelector((s: RootState) => s.uiTheme.mode);
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "dark" || saved === "light") {
        dispatch(hydrateThemeFromStorage(saved));
      }
    } catch {
      /* ignore */
    }
  }, [dispatch]);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  const theme = mode === "dark" ? dark : light;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <ThemeRoot>
        <AuthLoader>
          {children}
          <SiteFooter />
        </AuthLoader>
      </ThemeRoot>
    </Provider>
  );
}
