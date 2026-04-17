"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import VideoGridFlex from "../../components/VideoGridFlex";
import VideoItem from "../../components/VideoItem";
import { getSubscriptions } from "../../reducers/subscriptions";
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

export default function SubscriptionsPage() {
  const dispatch = useDispatch();
  const { loading, videos } = useSelector((state: any) => state.subscription);

  useEffect(() => {
    dispatch(getSubscriptions() as any);
    document.title = "Subscriptions";
  }, [dispatch]);

  return (
    <div onClick={() => dispatch(closeMenu())}>
      <Topbar />
      <Sidebar />
      <MainContainer>
        {loading ? (
          <p style={{ padding: "20px" }}>Loading Subscriptions...</p>
        ) : videos.length === 0 ? (
          <p style={{ padding: "20px" }}>No subscriptions yet. Subscribe to channels to see their videos here.</p>
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
