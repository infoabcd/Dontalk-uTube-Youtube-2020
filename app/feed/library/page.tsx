"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import SignInButton from "../../components/SignInButton";
import { closeMenu } from "../../reducers/menuSlice";
import { useAppDispatch } from "../../hooks";
import useUser from "../../hooks/useUser";

const MainContainer = styled.main`
  background-color: ${(props) => props.theme.mainBg};
  border-top: 1px solid ${(props) => props.theme.divider};
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

/* —— Logged out: YouTube-style empty library —— */
const EmptyCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 56px);
  padding: 48px 24px;
  text-align: center;
`;

const StackIconWrap = styled.div`
  width: 120px;
  height: 120px;
  margin-bottom: 24px;
  color: #909090;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const EmptyTitle = styled.h1`
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 500;
  color: ${(props) => props.theme.primaryColor};
`;

const EmptySubtitle = styled.p`
  margin: 0 0 28px;
  font-size: 14px;
  line-height: 1.5;
  color: ${(props) => props.theme.primaryColor};
  max-width: 420px;
`;

const SignInLink = styled(Link)`
  text-decoration: none;
  display: inline-flex;
`;

/* —— Logged in: playlists —— */
const LibraryInner = styled.div`
  padding: 24px 32px 48px;
  max-width: 1600px;
  margin: 0 auto;

  @media screen and (max-width: 1024px) {
    padding: 16px 16px 32px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.primaryColor};
`;

const SortButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.secondaryColor};
  text-transform: uppercase;
  letter-spacing: 0.02em;
  padding: 8px 4px;

  &:hover {
    color: ${(props) => props.theme.primaryColor};
  }
`;

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px 12px;

  @media screen and (min-width: 1400px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const PlaylistCard = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const ThumbWrap = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  background: ${(props) => props.theme.channelBg};
  margin-bottom: 10px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &:hover .hover-play {
    opacity: 1;
  }
`;

const ThumbSideOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 32%;
  min-width: 56px;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
`;

const HoverPlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  opacity: 0;
  transition: opacity 0.15s ease;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.05em;
`;

const CardTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.primaryColor};
  line-height: 1.35;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardMeta = styled.div`
  font-size: 13px;
  color: ${(props) => props.theme.secondaryColor};
  margin-bottom: 8px;
`;

const ViewFull = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.theme.secondaryColor};
  letter-spacing: 0.04em;
`;

type VideoLike = {
  id: string;
  thumb?: string;
  createdAt?: string;
};

type PlaylistRow = {
  id: string;
  title: string;
  href: string;
  count: number;
  thumb: string;
  updatedLabel: string;
};

function formatUpdatedLabel(items: VideoLike[]): string {
  if (!items.length) return "No videos yet";
  let latest = items[0].createdAt;
  for (const v of items) {
    if (!v.createdAt) continue;
    if (!latest || new Date(v.createdAt) > new Date(latest)) latest = v.createdAt;
  }
  if (!latest) return "Recently updated";
  const d = new Date(latest);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - d.getTime()) / 86400000
  );
  if (diffDays <= 0) return "Updated today";
  if (diffDays === 1) return "Updated yesterday";
  return `Updated ${diffDays} days ago`;
}

function LibraryStackIcon() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden>
      <rect
        x="18"
        y="28"
        width="72"
        height="52"
        rx="8"
        fill="currentColor"
        opacity="0.35"
      />
      <rect
        x="28"
        y="18"
        width="72"
        height="52"
        rx="8"
        fill="currentColor"
        opacity="0.55"
      />
      <rect
        x="38"
        y="38"
        width="72"
        height="52"
        rx="8"
        fill="#bdbdbd"
      />
      <path d="M68 58 L68 78 L88 68 Z" fill="#fff" />
    </svg>
  );
}

function PlaylistBadgeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M4 10h3v10H4V10zm6-6h3v16h-3V4zm6 4h3v12h-3V8zm6 2h3v10h-3V10z"
      />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"
      />
    </svg>
  );
}

const FALLBACK_THUMB = "https://picsum.photos/seed/library/640/360";

export default function LibraryPage() {
  const dispatch = useAppDispatch();
  const { userprofile, userdetail } = useUser();
  const [playlists, setPlaylists] = useState<PlaylistRow[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [sortMode, setSortMode] = useState<"recent" | "name">("recent");

  const loadPlaylists = useCallback(async () => {
    if (!userprofile?.uid) return;
    setLoadingLists(true);
    try {
      const [likedRes, histRes, subRes, chRes, trendRes] = await Promise.all([
        fetch("/api/liked"),
        fetch("/api/history"),
        fetch("/api/subscriptions"),
        fetch(`/api/channel/${userprofile.uid}`),
        fetch("/api/videos/trending"),
      ]);

      const liked: VideoLike[] = likedRes.ok ? await likedRes.json() : [];
      const history: VideoLike[] = histRes.ok ? await histRes.json() : [];
      const subs: VideoLike[] = subRes.ok ? await subRes.json() : [];
      const channelJson = chRes.ok ? await chRes.json() : null;
      const mine: VideoLike[] = channelJson?.videos ?? [];
      const trending: VideoLike[] = trendRes.ok ? await trendRes.json() : [];

      const rows: PlaylistRow[] = [
        {
          id: "liked",
          title: "Liked videos",
          href: "/feed/liked",
          count: liked.length,
          thumb: liked[0]?.thumb || FALLBACK_THUMB,
          updatedLabel: formatUpdatedLabel(liked),
        },
        {
          id: "history",
          title: "Watch history",
          href: "/feed/history",
          count: history.length,
          thumb: history[0]?.thumb || FALLBACK_THUMB,
          updatedLabel: formatUpdatedLabel(history),
        },
        {
          id: "subs",
          title: "From subscriptions",
          href: "/feed/subscriptions",
          count: subs.length,
          thumb: subs[0]?.thumb || FALLBACK_THUMB,
          updatedLabel: formatUpdatedLabel(subs),
        },
        {
          id: "yours",
          title: "Your videos",
          href: `/channel/${userprofile.uid}`,
          count: mine.length,
          thumb: mine[0]?.thumb || FALLBACK_THUMB,
          updatedLabel: formatUpdatedLabel(mine),
        },
        {
          id: "trending",
          title: "Trending",
          href: "/feed/trending",
          count: trending.length,
          thumb: trending[0]?.thumb || "https://picsum.photos/seed/trending/640/360",
          updatedLabel:
            trending.length > 0
              ? formatUpdatedLabel(trending)
              : "Popular on UTube",
        },
      ];

      setPlaylists(rows);
    } catch {
      setPlaylists([]);
    } finally {
      setLoadingLists(false);
    }
  }, [userprofile?.uid]);

  useEffect(() => {
    document.title = "Library";
  }, []);

  useEffect(() => {
    if (userprofile) {
      void loadPlaylists();
    }
  }, [userprofile, loadPlaylists]);

  const sortedPlaylists = useMemo(() => {
    const copy = [...playlists];
    if (sortMode === "name") {
      copy.sort((a, b) => a.title.localeCompare(b.title));
    }
    return copy;
  }, [playlists, sortMode]);

  const toggleSort = () => {
    setSortMode((m) => (m === "recent" ? "name" : "recent"));
  };

  if (userdetail.loading) {
    return (
      <div onClick={() => dispatch(closeMenu())}>
        <Topbar />
        <Sidebar />
        <MainContainer>
          <LibraryInner>
            <p style={{ padding: "24px", color: "#606060" }}>Loading…</p>
          </LibraryInner>
        </MainContainer>
      </div>
    );
  }

  if (!userprofile) {
    return (
      <div onClick={() => dispatch(closeMenu())}>
        <Topbar />
        <Sidebar />
        <MainContainer>
          <EmptyCenter>
            <StackIconWrap>
              <LibraryStackIcon />
            </StackIconWrap>
            <EmptyTitle>Enjoy your favorite videos</EmptyTitle>
            <EmptySubtitle>
              Sign in to access videos that you&apos;ve liked or saved
            </EmptySubtitle>
            <SignInLink href="/auth/signin">
              <SignInButton />
            </SignInLink>
          </EmptyCenter>
        </MainContainer>
      </div>
    );
  }

  return (
    <div onClick={() => dispatch(closeMenu())}>
      <Topbar />
      <Sidebar />
      <MainContainer>
        <LibraryInner>
          <SectionHeader>
            <SectionTitle>Created playlists</SectionTitle>
            <SortButton
              type="button"
              onClick={toggleSort}
              title="Toggle alphabetical / default order"
            >
              <SortIcon />
              SORT BY {sortMode === "recent" ? "A–Z" : "DEFAULT"}
            </SortButton>
          </SectionHeader>

          {loadingLists ? (
            <p style={{ color: "#606060", fontSize: 14 }}>Loading playlists…</p>
          ) : (
            <PlaylistGrid>
              {sortedPlaylists.map((p) => (
                <PlaylistCard key={p.id} href={p.href}>
                  <ThumbWrap>
                    <img src={p.thumb} alt="" />
                    <ThumbSideOverlay>
                      <span>{p.count}</span>
                      <PlaylistBadgeIcon />
                    </ThumbSideOverlay>
                    <HoverPlay className="hover-play">▶ PLAY ALL</HoverPlay>
                  </ThumbWrap>
                  <CardTitle>{p.title}</CardTitle>
                  <CardMeta>{p.updatedLabel}</CardMeta>
                  <ViewFull>VIEW FULL PLAYLIST</ViewFull>
                </PlaylistCard>
              ))}
            </PlaylistGrid>
          )}
        </LibraryInner>
      </MainContainer>
    </div>
  );
}
