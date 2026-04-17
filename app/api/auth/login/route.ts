import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyPassword, signToken } from "@/app/lib/auth";
import { toAuthClientUser } from "@/app/lib/auth-user";
import { checkRateLimit, getClientIp } from "@/app/lib/rateLimit";

/** 單 IP：每 15 分鐘最多登入嘗試次數（緩解密碼爆破） */
const LOGIN_MAX = 40;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

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
    const limited = checkRateLimit(`auth:login:${ip}`, LOGIN_MAX, LOGIN_WINDOW_MS);
    if (!limited.ok) {
      return tooMany(limited.retryAfterSec);
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signToken({ userId: user.id, email: user.email });

    const response = NextResponse.json({
      user: toAuthClientUser(user),
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
