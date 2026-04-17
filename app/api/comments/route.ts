import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const payload = await getCurrentUser();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { videoId, text } = await request.json();

    if (!videoId || !text?.trim()) {
      return NextResponse.json(
        { error: "Video ID and text are required" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        text: text.trim(),
        userId: payload.userId,
        videoId,
      },
      include: {
        user: {
          select: { id: true, displayName: true, photoURL: true },
        },
      },
    });

    return NextResponse.json(
      {
        id: comment.id,
        text: comment.text,
        createdAt: comment.createdAt,
        uid: comment.userId,
        info: {
          displayName: comment.user.displayName,
          photoURL: comment.user.photoURL,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
