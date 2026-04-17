"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import Avatar from "../../components/Avatar";
import EditProfile from "../../components/EditProfile";
import SubscribeButton from "../../components/SubscribeButton";
import VideoGridFlex from "../../components/VideoGridFlex";
import VideoItem from "../../components/VideoItem";
import { closeMenu } from "../../reducers/menuSlice";
import { updateProfile } from "../../reducers/userdetailSlice";
import { getChannel } from "../../reducers/channelSlice";
import type { RootState } from "../../store";
import useUser from "../../hooks/useUser";

type TabKey = "home" | "channels" | "about";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .banner {
    width: 100%;
    height: 185px;
    background: ${(props) => props.theme.channelBg};

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .channel-header {
    margin-top: 16px;
    padding: 0 80px;
    display: flex;
    align-items: center;

    .meta {
      margin-left: 18px;
      flex-grow: 1;

      .channel-name {
        font-size: 24px;
        letter-spacing: 1.1px;
      }
      .subscribers {
        font-size: 14px;
        color: ${(props) => props.theme.secondaryColor};
      }
    }

    .edit-profile-button {
      background-color: ${(props) => props.theme.toggle};
    }
  }

  .channel-tags {
    padding: 0 80px;
    display: flex;
    align-items: flex-start;
    margin-top: 16px;
    color: ${(props) => props.theme.secondaryColor};

    .tag {
      margin: 8px;
      padding: 0 24px;
      cursor: pointer;
      background: none;
      border: none;
      font: inherit;
    }

    .tag:hover {
      color: ${(props) => props.theme.primaryColor};
    }

    .active-tag {
      border-bottom: 2px solid ${(props) => props.theme.primaryColor};
      color: ${(props) => props.theme.primaryColor};
    }
  }

  .content {
    flex-grow: 1;
    background-color: ${(props) => props.theme.channelBg};
    padding-bottom: 48px;
  }

  .about-wrap {
    display: flex;
    padding: 24px 80px;
    gap: 48px;

    .description {
      flex: 1;
      font-size: 14px;
      line-height: 1.5;
    }

    .stat {
      min-width: 260px;
      font-size: 14px;
      .join-at {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid ${(props) => props.theme.divider};
      }
    }
  }

  .channels-wrap {
    display: flex;
    flex-wrap: wrap;
    margin: 18px 80px 0;
    gap: 24px;

    .ch {
      width: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-decoration: none;
      color: inherit;
    }

    .channel-name {
      font-size: 14px;
      font-weight: 500;
      margin-top: 16px;
      text-align: center;
    }
    .subscribers {
      font-size: 13px;
      color: ${(props) => props.theme.secondaryColor};
    }
  }

  @media screen and (max-width: 1024px) {
    .channel-header {
      padding: 0 16px;
    }

    .channel-tags {
      padding: 0 8px;
      overflow: auto;
      white-space: nowrap;
    }

    .about-wrap {
      padding: 18px 16px;
      gap: 24px;
      flex-direction: column;
    }

    .channels-wrap {
      margin: 18px 16px 0;
      gap: 14px;
    }
  }
`;

const MainContainer = styled.main`
  background-color: transparent;
  border-top: 1px solid ${(props: { theme: { divider: string } }) => props.theme.divider};
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

type ChannelProfile = {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  banner: string | null;
  description: string | null;
  createdAt: string;
};

type SubChannel = {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  subscribers: number;
};

export default function ChannelPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const channelId = params.uid as string;
  const uid = useSelector(
    (state: RootState) => state.userdetail.profile?.uid as string | undefined
  );
  const { userprofile } = useUser();
  const canManageChannelVideos =
    !!userprofile &&
    (userprofile.uid === channelId || userprofile.isPrivileged);

  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>("home");
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState<{
    profile: ChannelProfile;
    subscribers: number;
    subscribed: boolean;
    videos: Record<string, unknown>[];
    channels: SubChannel[];
  } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/channel/${channelId}`);
      if (!res.ok) {
        router.push("/");
        return;
      }
      const json = await res.json();
      setData(json);
      document.title = json.profile?.displayName || "Channel";
    } catch {
      router.push("/");
    } finally {
      setLoading(false);
    }
  }, [channelId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSubscribe = async () => {
    if (!uid) {
      router.push("/auth/signin");
      return;
    }
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId }),
      });
      if (!res.ok) return;
      const { subscribed } = await res.json();
      setData((prev) => {
        if (!prev) return prev;
        const delta = subscribed ? 1 : -1;
        return {
          ...prev,
          subscribed,
          subscribers: Math.max(0, prev.subscribers + (subscribed ? 1 : -1)),
        };
      });
      if (uid) {
        dispatch(getChannel(uid) as never);
      }
    } catch {
      /* ignore */
    }
  };

  const closeModal = (profile?: unknown) => {
    if (
      profile &&
      data &&
      typeof profile === "object" &&
      profile !== null &&
      "displayName" in profile
    ) {
      const p = profile as {
        displayName: string;
        photoURL?: string;
        banner?: string;
        description?: string;
      };
      setData({
        ...data,
        profile: {
          ...data.profile,
          displayName: p.displayName ?? data.profile.displayName,
          photoURL: p.photoURL ?? data.profile.photoURL,
          banner: p.banner ?? data.profile.banner,
          description: p.description ?? data.profile.description,
        },
      });
      dispatch(updateProfile({ profile: p }) as never);
    }
    setOpenModal(false);
  };

  if (loading || !data) {
    return (
      <div onClick={() => dispatch(closeMenu())}>
        <Topbar />
        <Sidebar />
        <MainContainer>
          <p style={{ padding: "20px" }}>Loading...</p>
        </MainContainer>
      </div>
    );
  }

  const { profile, subscribers, subscribed, videos, channels } = data;

  return (
    <div onClick={() => dispatch(closeMenu())}>
      <Topbar />
      <Sidebar />
      <MainContainer>
        <Wrapper>
          {profile.banner && (
            <div className="banner">
              <img src={profile.banner} alt="" />
            </div>
          )}
          <div className="channel-header">
            <Avatar large src={profile.photoURL ?? undefined} />
            <div className="meta">
              <div className="channel-name">{profile.displayName}</div>
              <div className="subscribers">{subscribers} subscribers</div>
            </div>

            {uid === channelId ? (
              <button
                type="button"
                className="edit-profile-button button"
                onClick={() => setOpenModal(true)}
              >
                EDIT PROFILE
              </button>
            ) : (
              <SubscribeButton
                subscribed={subscribed}
                handleSubscribe={handleSubscribe}
              />
            )}
          </div>
          <div className="channel-tags">
            <button
              type="button"
              className={tab === "home" ? "tag active-tag" : "tag"}
              onClick={() => setTab("home")}
            >
              HOME
            </button>
            <button
              type="button"
              className={tab === "channels" ? "tag active-tag" : "tag"}
              onClick={() => setTab("channels")}
            >
              CHANNELS
            </button>
            <button
              type="button"
              className={tab === "about" ? "tag active-tag" : "tag"}
              onClick={() => setTab("about")}
            >
              ABOUT
            </button>
          </div>

          <div className="content">
            {tab === "home" && (
              <VideoGridFlex miniWidth={330}>
                {videos.map((video) => (
                  <VideoItem
                    key={String(video.id)}
                    video={video as never}
                    canManage={canManageChannelVideos}
                    onDeleted={() => void load()}
                  />
                ))}
              </VideoGridFlex>
            )}
            {tab === "channels" && (
              <div className="channels-wrap">
                {channels.length === 0 && (
                  <p style={{ padding: "0 80px" }}>No channels yet.</p>
                )}
                {channels.map((c) => (
                  <Link key={c.uid} href={`/channel/${c.uid}`} className="ch">
                    <Avatar huge src={c.photoURL ?? undefined} />
                    <div className="channel-name">{c.displayName}</div>
                    <div className="subscribers">{c.subscribers} subscribers</div>
                  </Link>
                ))}
              </div>
            )}
            {tab === "about" && (
              <div className="about-wrap">
                <div className="description">
                  <p style={{ fontWeight: 600, marginBottom: 8 }}>Description</p>
                  <p>{profile.description || "No description."}</p>
                </div>
                <div className="stat">
                  <p style={{ fontWeight: 600 }}>Stats</p>
                  <div className="join-at">
                    Joined{" "}
                    {new Date(profile.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <EditProfile
            open={openModal}
            onClose={closeModal}
            profile={{
              displayName: profile.displayName,
              photoURL: profile.photoURL,
              banner: profile.banner,
              description: profile.description,
            }}
          />
        </Wrapper>
      </MainContainer>
    </div>
  );
}
