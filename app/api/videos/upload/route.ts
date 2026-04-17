import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { transcodeToHls } from "@/app/lib/transcode";
import { formatVideoResponse } from "@/app/lib/video-format";

export const runtime = "nodejs";
/** 上傳本體結束後即回應；轉碼在程序內非同步執行（自架長連線有效，Serverless 請改佇列） */
export const maxDuration = 300;

function runTranscodeInBackground(
  videoId: string,
  tmpPath: string,
  outDir: string
) {
  void (async () => {
    try {
      const { masterRelativeUrl, posterRelativeUrl } = await transcodeToHls(
        tmpPath,
        outDir
      );
      await fs.unlink(tmpPath).catch(() => {});

      await prisma.video.update({
        where: { id: videoId },
        data: {
          thumbnail: posterRelativeUrl,
          videoUrl: masterRelativeUrl,
          hlsMasterUrl: masterRelativeUrl,
          processingStatus: "ready",
        },
      });
    } catch (err) {
      console.error("Background transcode error:", err);
      await fs.unlink(tmpPath).catch(() => {});
      await fs.rm(outDir, { recursive: true, force: true }).catch(() => {});
      await prisma.video
        .update({
          where: { id: videoId },
          data: { processingStatus: "failed" },
        })
        .catch(() => {});
    }
  })();
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getCurrentUser();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!file || !(file instanceof Blob) || !title) {
      return NextResponse.json(
        { error: "Title and video file are required" },
        { status: 400 }
      );
    }

    const size = file.size;
    if (size / (1024 * 1024) > 200) {
      return NextResponse.json(
        { error: "File too large (max 200MB)" },
        { status: 400 }
      );
    }

    const videoId = randomUUID();
    const tmpDir = path.join(process.cwd(), "public", "uploads", "tmp");
    const outDir = path.join(process.cwd(), "public", "uploads", "videos", videoId);
    const origName =
      typeof (file as File).name === "string" ? (file as File).name : "video.bin";
    const ext = path.extname(origName) || ".mp4";
    const tmpPath = path.join(tmpDir, `${videoId}${ext}`);

    await fs.mkdir(tmpDir, { recursive: true });
    await fs.mkdir(outDir, { recursive: true });

    const buf = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(tmpPath, buf);

    const video = await prisma.video.create({
      data: {
        id: videoId,
        title,
        description: description || null,
        thumbnail: null,
        videoUrl: "",
        hlsMasterUrl: null,
        processingStatus: "processing",
        userId: payload.userId,
      },
      include: {
        user: {
          select: { id: true, displayName: true, photoURL: true },
        },
      },
    });

    runTranscodeInBackground(videoId, tmpPath, outDir);

    return NextResponse.json(formatVideoResponse(video), { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
