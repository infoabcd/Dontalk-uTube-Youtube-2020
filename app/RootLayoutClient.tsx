"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { ThemeProvider } from "styled-components";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import store from "./store";
import { light } from "./styled/themes";
import GlobalStyle from "./styled/GlobalStyle";
import { checkAuth } from "./reducers/userdetailSlice";

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

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={light}>
        <GlobalStyle />
        <AuthLoader>{children}</AuthLoader>
      </ThemeProvider>
    </Provider>
  );
}
