import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";

const execFileAsync = promisify(execFile);

type Variant = {
  dir: string;
  height: number;
  bandwidth: number;
  videoBitrate: string;
  width: number;
};

/** 由低到高；名稱對應典型高度（寬度依 16:9 取整） */
const ALL_RUNGS: Variant[] = [
  { dir: "144p", height: 144, bandwidth: 220_000, videoBitrate: "180k", width: 256 },
  { dir: "360p", height: 360, bandwidth: 900_000, videoBitrate: "800k", width: 640 },
  { dir: "480p", height: 480, bandwidth: 2_200_000, videoBitrate: "2000k", width: 854 },
  { dir: "720p", height: 720, bandwidth: 5_000_000, videoBitrate: "4500k", width: 1280 },
  { dir: "1080p", height: 1080, bandwidth: 9_000_000, videoBitrate: "7500k", width: 1920 },
];

/**
 * 以較短邊作為「幾 p」對齊用（例如 640×360 → 360；256×144 → 144）。
 * 不超過此值的階梯才輸出，避免低解析來源被強制放大成 480/720。
 */
function selectVariantsForSource(sourceMinSide: number): Variant[] {
  if (sourceMinSide >= 1080) {
    // 來源至少 1080p：輸出 144、360、480、720、1080
    const heights = [144, 360, 480, 720, 1080];
    return heights
      .map((h) => ALL_RUNGS.find((r) => r.height === h))
      .filter((v): v is Variant => v != null);
  }

  const heightsAsc = [144, 360, 480, 720];
  const picked = heightsAsc.filter((h) => h <= sourceMinSide);
  return picked
    .map((h) => ALL_RUNGS.find((r) => r.height === h))
    .filter((v): v is Variant => v != null);
}

async function probeMinSide(
  ffmpegPath: string,
  inputPath: string
): Promise<number> {
  let stderr = "";
  try {
    await execFileAsync(ffmpegPath, ["-hide_banner", "-i", inputPath], {
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch (err: unknown) {
    const e = err as { stderr?: Buffer; message?: string };
    stderr = e.stderr?.toString("utf8") ?? "";
  }
  const m = stderr.match(
    /Stream\s+#\d+:\d+(?:\([^)]*\))?:\s*Video:[^\n]*?\s(\d{2,5})x(\d{2,5})/
  );
  if (!m) {
    throw new Error("Could not read video resolution from ffmpeg probe output");
  }
  const w = parseInt(m[1], 10);
  const h = parseInt(m[2], 10);
  if (!Number.isFinite(w) || !Number.isFinite(h)) {
    throw new Error("Invalid video dimensions from probe");
  }
  return Math.min(w, h);
}

export async function transcodeToHls(
  inputPath: string,
  outputRoot: string
): Promise<{ masterRelativeUrl: string; posterRelativeUrl: string }> {
  const { default: ffmpegInstaller } = await import("@ffmpeg-installer/ffmpeg");
  const ffmpegPath = ffmpegInstaller.path;

  const sourceMinSide = await probeMinSide(ffmpegPath, inputPath);
  const variants = selectVariantsForSource(sourceMinSide);

  if (variants.length === 0) {
    throw new Error("No HLS variants to generate (unexpected source size)");
  }

  await fs.mkdir(outputRoot, { recursive: true });

  for (const v of variants) {
    const variantDir = path.join(outputRoot, v.dir);
    await fs.mkdir(variantDir, { recursive: true });
    const playlistPath = path.join(variantDir, "playlist.m3u8");

    await execFileAsync(ffmpegPath, [
      "-y",
      "-i",
      inputPath,
      "-vf",
      `scale=-2:${v.height}`,
      "-c:v",
      "libx264",
      "-b:v",
      v.videoBitrate,
      "-preset",
      "fast",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-ac",
      "2",
      "-f",
      "hls",
      "-hls_time",
      "6",
      "-hls_list_size",
      "0",
      "-hls_segment_filename",
      path.join(variantDir, "segment%03d.ts"),
      playlistPath,
    ]);
  }

  const masterPath = path.join(outputRoot, "master.m3u8");
  const masterBody = buildMasterPlaylist(variants);
  await fs.writeFile(masterPath, masterBody, "utf8");

  const posterPath = path.join(outputRoot, "poster.jpg");
  const posterW = Math.min(640, Math.max(1, sourceMinSide));
  await execFileAsync(ffmpegPath, [
    "-y",
    "-ss",
    "00:00:01",
    "-i",
    inputPath,
    "-vframes",
    "1",
    "-vf",
    `scale=${posterW}:-1`,
    posterPath,
  ]);

  return {
    masterRelativeUrl: `/uploads/videos/${path.basename(outputRoot)}/master.m3u8`,
    posterRelativeUrl: `/uploads/videos/${path.basename(outputRoot)}/poster.jpg`,
  };
}

function buildMasterPlaylist(variants: Variant[]): string {
  const sorted = [...variants].sort((a, b) => a.bandwidth - b.bandwidth);
  const lines = ["#EXTM3U", "#EXT-X-VERSION:3"];
  for (const v of sorted) {
    lines.push(
      `#EXT-X-STREAM-INF:BANDWIDTH=${v.bandwidth},RESOLUTION=${v.width}x${v.height},NAME="${v.dir}"`
    );
    lines.push(`${v.dir}/playlist.m3u8`);
  }
  return `${lines.join("\n")}\n`;
}
