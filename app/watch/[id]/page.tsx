"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import VideoPlayer from "../../components/VideoPlayer";
import ViewsAndAgo from "../../components/ViewsAndAgo";
import Liked from "../../components/Liked";
import Comments from "../../components/Comments";
import Avatar from "../../components/Avatar";
import PlaylistContainer from "../../components/PlaylistContainer";
import useUser from "../../hooks/useUser";
import { getFeed } from "../../reducers/feedSlice";
import { closeMenu } from "../../reducers/menuSlice";
import type { AppDispatch, RootState } from "../../store";

type VideoDetails = {
  id: string;
  title: string;
  description?: string;
  thumb?: string;
  url: string;
  hlsMasterUrl?: string | null;
  videoUrl?: string;
  processingStatus?: string;
  views: number;
  createdAt: string;
  uid: string;
  canDelete?: boolean;
  info?: {
    displayName?: string;
    photoURL?: string;
  };
  comments?: Array<{
    id: string;
    text: string;
    createdAt: string;
    uid: string;
    info: { displayName: string; photoURL?: string | null };
  }>;
};

type FeedVideo = Pick<
  VideoDetails,
  "id" | "title" | "thumb" | "createdAt" | "views" | "uid" | "info" | "processingStatus"
>;

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

const WatchWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 24px 24px 0;

  .video-container {
    flex-grow: 1;
  }

  .video-info {
    margin: 24px 0 8px;

    .title {
      font-weight: 400;
      font-size: 18px;
      color: ${(props) => props.theme.primaryColor};
    }
    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .delete-video-btn {
      border: 1.5px solid ${(props) => props.theme.divider};
      background: ${(props) => props.theme.barBg};
      color: #c62828;
      border-radius: 2px;
      padding: 6px 14px;
      font-size: 13px;
      cursor: pointer;
    }

    .delete-video-btn:hover:not(:disabled) {
      background: #ffebee;
    }

    .delete-video-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .top-row {
    padding-top: 16px;
    border-top: 1px solid ${(props) => props.theme.divider};
    display: flex;

    .owner {
      flex-grow: 1;
      display: flex;
      justify-content: flex-start;

      .upload-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 14px;
        line-height: 15px;
        .channel-name {
          height: auto;
        }
        .sub-count {
          font-size: 13px;
          color: ${(props) => props.theme.secondaryColor};
        }
      }
    }
  }

  .video-description {
    margin: 0 56px;
  }

  .next-play {
    width: 400px;
    margin-left: 24px;
  }

  @media screen and (max-width: 1400px) {
    .next-play {
      display: none;
    }
  }

  @media screen and (max-width: 1024px) {
    padding: 14px 12px 0;

    .video-info {
      margin: 16px 0 8px;

      .title {
        font-size: 16px;
      }

      .info {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }

    .top-row .owner .upload-info {
      font-size: 13px;
    }

    .video-description {
      margin: 0 0 0 44px;
      font-size: 14px;
    }
  }
`;

export default function Watch() {
  const params = useParams();
  const videoId = params.id as string;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { userprofile } = useUser();
  const { loading: feedLoading, videos: feedVideos } = useSelector((state: RootState) => state.feed);

  useEffect(() => {
    let isMounted = true;

    const loadVideo = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/videos/${videoId}`);
        if (!res.ok) {
          router.push("/");
          return;
        }
        const data: VideoDetails = await res.json();
        if (isMounted) {
          setVideo(data);
          document.title = data.title;
        }
      } catch (error) {
        if (isMounted) {
          setVideo(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadVideo();

    return () => {
      isMounted = false;
    };
  }, [videoId, router]);

  useEffect(() => {
    if (video?.processingStatus !== "processing") {
      return undefined;
    }
    const timer = window.setInterval(() => {
      void (async () => {
        try {
          const res = await fetch(`/api/videos/${videoId}`);
          if (!res.ok) return;
          const data = (await res.json()) as VideoDetails;
          setVideo((prev) => {
            if (!prev) return data;
            return { ...data, comments: data.comments ?? prev.comments };
          });
          if (data.processingStatus === "ready" || data.processingStatus === "failed") {
            window.clearInterval(timer);
          }
        } catch {
          // ignore
        }
      })();
    }, 4000);
    return () => window.clearInterval(timer);
  }, [video?.processingStatus, videoId]);

  useEffect(() => {
    if (feedLoading) {
      dispatch(getFeed());
    }
  }, [dispatch, feedLoading]);

  useEffect(() => {
    if (!video || !userprofile) {
      return;
    }

    const controller = new AbortController();

    fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId }),
      signal: controller.signal,
    }).catch(() => {
      // history write failures shouldn't break the watch view
    });

    return () => controller.abort();
  }, [video, userprofile, videoId]);

  const handleDeleteVideo = async () => {
    if (!video?.canDelete || deleting) return;
    if (!window.confirm("確定要刪除此影片？此操作無法還原。")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/videos/${videoId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        window.alert(data.error || "刪除失敗");
      }
    } catch {
      window.alert("刪除失敗");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div onClick={() => dispatch(closeMenu())}>
        <Topbar />
        <Sidebar />
        <MainContainer><p style={{ padding: "20px" }}>Loading...</p></MainContainer>
      </div>
    );
  }

  if (!video) {
    return (
      <div onClick={() => dispatch(closeMenu())}>
        <Topbar />
        <Sidebar />
        <MainContainer><p style={{ padding: "20px" }}>Video not found</p></MainContainer>
      </div>
    );
  }

  return (
    <div onClick={() => dispatch(closeMenu())}>
      <Topbar />
      <Sidebar />
      <MainContainer>
        <WatchWrapper>
          <div className="video-container">
            <VideoPlayer video={video} videoId={videoId} />
            <div className="video-info">
              <div className="title">{video.title}</div>
              <div className="info">
                <ViewsAndAgo video={video} />
                <div className="actions">
                  <Liked targetId={videoId} />
                  {video.canDelete && (
                    <button
                      type="button"
                      className="delete-video-btn"
                      disabled={deleting}
                      onClick={() => void handleDeleteVideo()}
                    >
                      {deleting ? "刪除中…" : "刪除影片"}
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="secondary-info">
              <div className="top-row">
                <div className="owner">
                  <div className="avatar">
                    <Avatar medium src={video.info?.photoURL} />
                  </div>
                  <div className="upload-info">
                    <span className="channel-name">
                      <Link href={`/channel/${video.uid}`}>{video.info?.displayName}</Link>
                    </span>
                  </div>
                </div>
              </div>
              <div className="video-description">{video.description}</div>
            </div>
            <Comments videoId={videoId} />
          </div>
          <div className="next-play">
            <p>Up next</p>
            {!feedLoading && (
              <PlaylistContainer
                videos={(feedVideos as FeedVideo[]).filter((feedVideo) => feedVideo.id !== videoId)}
              />
            )}
          </div>
        </WatchWrapper>
      </MainContainer>
    </div>
  );
}
