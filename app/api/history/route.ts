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

    const history = await prisma.history.findMany({
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

    const formatted = history.map((h) => formatVideoResponse(h.video));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Fetch history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
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

    await prisma.history.upsert({
      where: {
        userId_videoId: { userId: payload.userId, videoId },
      },
      update: { createdAt: new Date() },
      create: { userId: payload.userId, videoId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add history error:", error);
    return NextResponse.json(
      { error: "Failed to add history" },
      { status: 500 }
    );
  }
}
