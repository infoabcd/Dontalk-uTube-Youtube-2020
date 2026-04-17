import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { formatVideoResponse } from "@/app/lib/video-format";

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
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
    console.error("Fetch videos error:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
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

    const { title, description, thumbnail, videoUrl } = await request.json();

    if (!title || !videoUrl) {
      return NextResponse.json(
        { error: "Title and video URL are required" },
        { status: 400 }
      );
    }

    const video = await prisma.video.create({
      data: {
        title,
        description: description || "",
        thumbnail: thumbnail || "",
        videoUrl,
        hlsMasterUrl: null,
        processingStatus: "ready",
        userId: payload.userId,
      },
      include: {
        user: {
          select: { id: true, displayName: true, photoURL: true },
        },
      },
    });

    return NextResponse.json(formatVideoResponse(video), { status: 201 });
  } catch (error) {
    console.error("Create video error:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
