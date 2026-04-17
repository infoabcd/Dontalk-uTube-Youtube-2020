import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;
    const payload = await getCurrentUser();

    const subs = await prisma.subscription.findMany({
      where: { subscriberId: uid },
      include: {
        channel: {
          select: { id: true, displayName: true, photoURL: true },
        },
      },
    });

    const channels = subs.map((s) => ({
      uid: s.channel.id,
      displayName: s.channel.displayName,
      photoURL: s.channel.photoURL,
    }));

    return NextResponse.json(channels);
  } catch (error) {
    console.error("Fetch channels error:", error);
    return NextResponse.json(
      { error: "Failed to fetch channels" },
      { status: 500 }
    );
  }
}
