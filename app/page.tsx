"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import VideoGridFlex from "./components/VideoGridFlex";
import VideoItem from "./components/VideoItem";
import { getFeed } from "./reducers/feedSlice";
import styled from "styled-components";
import { closeMenu } from "./reducers/menuSlice";

const MainContainer = styled.main`
  background-color: transparent;
  border-top: 1px solid ${(props: any) => props.theme.divider};
  margin-top: 56px;
  margin-left: 240px;
  overflow: auto;
  width: calc(100vw - 240px);
  min-height: calc(100vh - 56px);
`;

export default function Home() {
  const dispatch = useDispatch();
  const { loading, videos } = useSelector((state: any) => state.feed);

  useEffect(() => {
    dispatch(getFeed() as any);
    document.title = "Home";
  }, [dispatch]);

  return (
    <div onClick={() => dispatch(closeMenu())}>
      <Topbar />
      <Sidebar />
      <MainContainer>
        {loading ? (
          <p style={{ padding: "20px" }}>Loading Feed...</p>
        ) : (
          <VideoGridFlex miniWidth={330}>
            {videos.map((video: any) => (
              <VideoItem key={video.id} video={video} />
            ))}
          </VideoGridFlex>
        )}
      </MainContainer>
    </div>
  );
}
