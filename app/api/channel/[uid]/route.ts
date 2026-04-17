import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { formatVideoResponse } from "@/app/lib/video-format";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;
    const payload = await getCurrentUser();

    const user = await prisma.user.findUnique({
      where: { id: uid },
      select: {
        id: true,
        displayName: true,
        photoURL: true,
        banner: true,
        description: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    const [subscriberCount, videos, subscribedRows, ownerSubscriptions] =
      await Promise.all([
        prisma.subscription.count({ where: { channelId: uid } }),
        prisma.video.findMany({
          where: { userId: uid },
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: { id: true, displayName: true, photoURL: true },
            },
          },
        }),
        payload
          ? prisma.subscription.findUnique({
              where: {
                subscriberId_channelId: {
                  subscriberId: payload.userId,
                  channelId: uid,
                },
              },
            })
          : Promise.resolve(null),
        prisma.subscription.findMany({
          where: { subscriberId: uid },
          include: {
            channel: {
              select: { id: true, displayName: true, photoURL: true },
            },
          },
        }),
      ]);

    const subscribedChannels = await Promise.all(
      ownerSubscriptions.map(async (s) => {
        const subCount = await prisma.subscription.count({
          where: { channelId: s.channel.id },
        });
        return {
          uid: s.channel.id,
          displayName: s.channel.displayName,
          photoURL: s.channel.photoURL,
          subscribers: subCount,
        };
      })
    );

    return NextResponse.json({
      profile: {
        uid: user.id,
        displayName: user.displayName,
        photoURL: user.photoURL,
        banner: user.banner,
        description: user.description,
        createdAt: user.createdAt,
      },
      subscribers: subscriberCount,
      subscribed: !!subscribedRows,
      videos: videos.map((v) => formatVideoResponse(v)),
      channels: subscribedChannels,
    });
  } catch (error) {
    console.error("Channel page error:", error);
    return NextResponse.json(
      { error: "Failed to load channel" },
      { status: 500 }
    );
  }
}
