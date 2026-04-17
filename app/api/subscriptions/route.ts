import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { formatVideoResponse } from "@/app/lib/video-format";

export async function GET() {
  try {
    const payload = await getCurrentUser();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subs = await prisma.subscription.findMany({
      where: { subscriberId: payload.userId },
      include: {
        channel: {
          select: { id: true, displayName: true, photoURL: true },
        },
      },
    });

    const channelIds = subs.map((s) => s.channelId);

    const videos = await prisma.video.findMany({
      where: { userId: { in: channelIds } },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, displayName: true, photoURL: true },
        },
      },
    });

    const formatted = videos.map((v) => formatVideoResponse(v));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Fetch subscriptions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getCurrentUser();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { channelId } = await request.json();

    if (!channelId || channelId === payload.userId) {
      return NextResponse.json({ error: "Invalid channel" }, { status: 400 });
    }

    const existing = await prisma.subscription.findUnique({
      where: {
        subscriberId_channelId: {
          subscriberId: payload.userId,
          channelId,
        },
      },
    });

    if (existing) {
      await prisma.subscription.delete({ where: { id: existing.id } });
      return NextResponse.json({ subscribed: false });
    }

    await prisma.subscription.create({
      data: { subscriberId: payload.userId, channelId },
    });

    return NextResponse.json({ subscribed: true });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
