import type { User, Video } from "@/app/generated/prisma/client";

type VideoWithUser = Video & {
  user: Pick<User, "id" | "displayName" | "photoURL">;
};

export function formatVideoResponse(v: VideoWithUser) {
  const playbackUrl = v.hlsMasterUrl || v.videoUrl;
  return {
    id: v.id,
    title: v.title,
    description: v.description,
    thumb: v.thumbnail,
    url: playbackUrl,
    hlsMasterUrl: v.hlsMasterUrl,
    videoUrl: v.videoUrl,
    processingStatus: v.processingStatus,
    views: v.views,
    createdAt: v.createdAt,
    uid: v.userId,
    info: {
      displayName: v.user.displayName,
      photoURL: v.user.photoURL,
    },
  };
}
