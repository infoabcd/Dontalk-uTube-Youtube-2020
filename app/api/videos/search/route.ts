import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { formatVideoResponse } from "@/app/lib/video-format";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) {
    return NextResponse.json([]);
  }

  try {
    const videos = await prisma.video.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { user: { displayName: { contains: q } } },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, displayName: true, photoURL: true },
        },
      },
    });

    return NextResponse.json(videos.map((v) => formatVideoResponse(v)));
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
