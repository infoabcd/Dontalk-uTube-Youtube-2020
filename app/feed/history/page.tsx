"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import VideoGridFlex from "../../components/VideoGridFlex";
import VideoItem from "../../components/VideoItem";
import { getHistory } from "../../reducers/historySlice";
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

  @media screen and (max-width: 1024px) {
    margin-left: 0;
    width: 100vw;
  }
`;

export default function HistoryPage() {
  const dispatch = useDispatch();
  const { loading, value: videos } = useSelector((state: any) => state.history);

  useEffect(() => {
    dispatch(getHistory() as any);
    document.title = "History";
  }, [dispatch]);

  return (
    <div onClick={() => dispatch(closeMenu())}>
      <Topbar />
      <Sidebar />
      <MainContainer>
        {loading ? (
          <p style={{ padding: "20px" }}>Loading History...</p>
        ) : videos.length === 0 ? (
          <p style={{ padding: "20px" }}>No watch history yet.</p>
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
