import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/app/lib/prisma";
import { formatVideoResponse } from "@/app/lib/video-format";
import { getCurrentUser } from "@/app/lib/auth";
import { isPrivilegedUser } from "@/app/lib/privileged";

export async function GET(
  _request: NextRequest,
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

    const countView = video.processingStatus === "ready";
    if (countView) {
      await prisma.video.update({
        where: { id },
        data: { views: { increment: 1 } },
      });
    }

    const { comments, ...videoRow } = video;

    const auth = await getCurrentUser();
    const canDelete =
      !!auth &&
      (video.userId === auth.userId ||
        isPrivilegedUser(auth.userId, auth.email));

    return NextResponse.json({
      ...formatVideoResponse(videoRow),
      views: countView ? video.views + 1 : video.views,
      canDelete,
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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await getCurrentUser();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const video = await prisma.video.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const privileged = isPrivilegedUser(payload.userId, payload.email);
    if (video.userId !== payload.userId && !privileged) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.video.delete({ where: { id } });

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "videos",
      id
    );
    await fs.rm(uploadDir, { recursive: true, force: true }).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete video error:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
