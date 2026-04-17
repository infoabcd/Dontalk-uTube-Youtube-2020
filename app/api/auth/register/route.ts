import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { hashPassword, signToken } from "@/app/lib/auth";
import { toAuthClientUser } from "@/app/lib/auth-user";
import { checkRateLimit, getClientIp } from "@/app/lib/rateLimit";
import { getValidInviteCodes, isValidInviteCode } from "@/app/lib/invite";

/** 單 IP：每小時最多註冊嘗試次數（緩解爆破／濫註冊） */
const REGISTER_MAX = 12;
const REGISTER_WINDOW_MS = 60 * 60 * 1000;

function tooMany(retryAfterSec: number) {
  return NextResponse.json(
    { error: "請求過於頻繁，請稍後再試" },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limited = checkRateLimit(`auth:register:${ip}`, REGISTER_MAX, REGISTER_WINDOW_MS);
    if (!limited.ok) {
      return tooMany(limited.retryAfterSec);
    }

    const { email, password, displayName, inviteCode } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const codes = getValidInviteCodes();
    if (codes.length > 0) {
      if (inviteCode == null || String(inviteCode).trim() === "") {
        return NextResponse.json({ error: "需要邀請碼" }, { status: 400 });
      }
      if (!isValidInviteCode(String(inviteCode))) {
        return NextResponse.json({ error: "邀請碼無效" }, { status: 403 });
      }
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        displayName: displayName || email.split("@")[0],
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || email)}&background=random`,
      },
    });

    const token = signToken({ userId: user.id, email: user.email });

    const response = NextResponse.json(
      {
        user: toAuthClientUser(user),
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
