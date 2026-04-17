import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { toAuthClientUser } from "@/app/lib/auth-user";

export async function GET() {
  try {
    const payload = await getCurrentUser();
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        photoURL: true,
        banner: true,
        description: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: toAuthClientUser(user),
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await getCurrentUser();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { displayName, description, photoURL, banner } = await request.json();

    const user = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        ...(displayName !== undefined && { displayName }),
        ...(photoURL !== undefined && { photoURL }),
        ...(description !== undefined && { description }),
        ...(banner !== undefined && { banner }),
      },
    });

    return NextResponse.json({
      user: toAuthClientUser(user),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
