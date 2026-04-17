"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import VideoGridFlex from "../../components/VideoGridFlex";
import VideoItem from "../../components/VideoItem";
import { closeMenu } from "../../reducers/menuSlice";
import type { AppDispatch } from "../../store";

const MainContainer = styled.main`
  background-color: transparent;
  border-top: 1px solid ${(props: { theme: { divider: string } }) =>
    props.theme.divider};
  margin-top: 56px;
  margin-left: 240px;
  overflow: auto;
  width: calc(100vw - 240px);
  min-height: calc(100vh - 56px);
`;

const ResultsHeader = styled.div`
  padding: 20px 24px 8px;
  max-width: 100%;
`;

const ResultsTitle = styled.h1`
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => props.theme.secondaryColor};
  line-height: 1.4;
`;

const QueryEmphasis = styled.span`
  color: ${(props) => props.theme.primaryColor};
  font-weight: 500;
`;

const ResultsMeta = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${(props) => props.theme.secondaryColor};
`;

const EmptyHint = styled.p`
  padding: 24px;
  color: ${(props) => props.theme.secondaryColor};
  font-size: 14px;
`;

type VideoRow = {
  id: string;
  title: string;
  thumb?: string;
  uid: string;
  info?: { displayName?: string; photoURL?: string | null };
  createdAt?: string;
  views?: number;
};

export default function SearchResultsPage() {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const rawQuery = params.query;
  const decodedQuery = useMemo(() => {
    if (typeof rawQuery !== "string") return "";
    try {
      return decodeURIComponent(rawQuery);
    } catch {
      return rawQuery;
    }
  }, [rawQuery]);

  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!decodedQuery.trim()) {
      setVideos([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/videos/search?q=${encodeURIComponent(decodedQuery)}`
        );
        if (!res.ok) {
          throw new Error("Search failed");
        }
        const data = await res.json();
        if (!cancelled) {
          setVideos(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!cancelled) {
          setError("無法完成搜尋，請稍後再試。");
          setVideos([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void run();
    document.title = `${decodedQuery} - Search`;

    return () => {
      cancelled = true;
    };
  }, [decodedQuery]);

  return (
    <div onClick={() => dispatch(closeMenu())}>
      <Topbar />
      <Sidebar />
      <MainContainer>
        <ResultsHeader>
          <ResultsTitle>
            搜尋結果：<QueryEmphasis>「{decodedQuery || "（空）"}」</QueryEmphasis>
          </ResultsTitle>
          {!loading && !error && (
            <ResultsMeta>
              共找到 {videos.length} 條影片
            </ResultsMeta>
          )}
        </ResultsHeader>

        {loading ? (
          <p style={{ padding: "20px" }}>搜尋中…</p>
        ) : error ? (
          <EmptyHint>{error}</EmptyHint>
        ) : videos.length === 0 ? (
          <EmptyHint>
            找不到與「{decodedQuery}」相關的影片，請換個關鍵字試試。
          </EmptyHint>
        ) : (
          <VideoGridFlex miniWidth={330}>
            {videos.map((video) => (
              <VideoItem key={video.id} video={video} />
            ))}
          </VideoGridFlex>
        )}
      </MainContainer>
    </div>
  );
}
