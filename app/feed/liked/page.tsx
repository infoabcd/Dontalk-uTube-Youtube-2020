"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import VideoGridFlex from "../../components/VideoGridFlex";
import VideoItem from "../../components/VideoItem";
import { getLikedVideo } from "../../reducers/likedVideoSlice";
import styled from "styled-components";
import { closeMenu } from "../../reducers/menuSlice";

const MainContainer = styled.main`
  background-color: transparent;
  border-top: 1px solid ${(props: any) => props.theme.divider};
  margin-top: 56px;
  margin-left: 240px;
  overflow: auto;
  width: calc(100vw - 240px);
  min-height: calc(100vh - 56px);
`;

export default function LikedVideoPage() {
  const dispatch = useDispatch();
  const { loading, videos } = useSelector((state: any) => state.liked);

  useEffect(() => {
    dispatch(getLikedVideo() as any);
    document.title = "Liked Videos";
  }, [dispatch]);

  return (
    <div onClick={() => dispatch(closeMenu())}>
      <Topbar />
      <Sidebar />
      <MainContainer>
        {loading ? (
          <p style={{ padding: "20px" }}>Loading Liked Videos...</p>
        ) : videos.length === 0 ? (
          <p style={{ padding: "20px" }}>No liked videos yet.</p>
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
