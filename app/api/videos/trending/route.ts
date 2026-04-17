import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { formatVideoResponse } from "@/app/lib/video-format";

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { views: "desc" },
      take: 50,
      include: {
        user: {
          select: { id: true, displayName: true, photoURL: true },
        },
      },
    });

    const formatted = videos.map((v) => formatVideoResponse(v));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Fetch trending error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending" },
      { status: 500 }
    );
  }
}
