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

    const liked = await prisma.likedVideo.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: "desc" },
      include: {
        video: {
          include: {
            user: {
              select: { id: true, displayName: true, photoURL: true },
            },
          },
        },
      },
    });

    const formatted = liked.map((l) => formatVideoResponse(l.video));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Fetch liked error:", error);
    return NextResponse.json(
      { error: "Failed to fetch liked videos" },
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

    const { videoId } = await request.json();

    const existing = await prisma.likedVideo.findUnique({
      where: {
        userId_videoId: { userId: payload.userId, videoId },
      },
    });

    if (existing) {
      await prisma.likedVideo.delete({ where: { id: existing.id } });
      return NextResponse.json({ liked: false });
    }

    await prisma.likedVideo.create({
      data: { userId: payload.userId, videoId },
    });

    return NextResponse.json({ liked: true });
  } catch (error) {
    console.error("Like video error:", error);
    return NextResponse.json(
      { error: "Failed to update like" },
      { status: 500 }
    );
  }
}
