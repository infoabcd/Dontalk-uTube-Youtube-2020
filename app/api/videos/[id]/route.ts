import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { formatVideoResponse } from "@/app/lib/video-format";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, displayName: true, photoURL: true },
        },
        comments: {
          include: {
            user: {
              select: { id: true, displayName: true, photoURL: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Increment views
    await prisma.video.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    const { comments, ...videoRow } = video;

    return NextResponse.json({
      ...formatVideoResponse(videoRow),
      views: video.views + 1,
      comments: comments.map((c) => ({
        id: c.id,
        text: c.text,
        createdAt: c.createdAt,
        uid: c.userId,
        info: {
          displayName: c.user.displayName,
          photoURL: c.user.photoURL,
        },
      })),
    });
  } catch (error) {
    console.error("Fetch video error:", error);
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}
