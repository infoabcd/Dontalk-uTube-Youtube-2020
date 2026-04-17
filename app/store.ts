import { configureStore } from '@reduxjs/toolkit';
import userdetailReduce from './reducers/userdetailSlice';
import sidebarReduce from './reducers/sidebarSlice';
import feedReduce from './reducers/feedSlice';
import subscriptionReduce from './reducers/subscriptions';
import trendingReduce from './reducers/trendingSlice';
import channelReduce from './reducers/channelSlice';
import gridReduce from './reducers/gridSlice';
import historyReduce from './reducers/historySlice';
import likedVideoReduce from './reducers/likedVideoSlice';
import menuReduce from './reducers/menuSlice';
import uiThemeReduce from './reducers/uiThemeSlice';

export const store = configureStore({
  reducer: {
    uiTheme: uiThemeReduce,
    userdetail: userdetailReduce,
    sidebar: sidebarReduce,
    feed: feedReduce,
    subscription: subscriptionReduce,
    channel: channelReduce,
    trending: trendingReduce,
    grid: gridReduce,
    history: historyReduce,
    liked: likedVideoReduce,
    menu: menuReduce,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
