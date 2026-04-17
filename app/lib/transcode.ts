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

const VARIANTS: Variant[] = [
  { dir: "360p", height: 360, bandwidth: 900_000, videoBitrate: "800k", width: 640 },
  { dir: "480p", height: 480, bandwidth: 2_200_000, videoBitrate: "2000k", width: 854 },
  { dir: "720p", height: 720, bandwidth: 5_000_000, videoBitrate: "4500k", width: 1280 },
];

export async function transcodeToHls(
  inputPath: string,
  outputRoot: string
): Promise<{ masterRelativeUrl: string; posterRelativeUrl: string }> {
  const { default: ffmpegInstaller } = await import("@ffmpeg-installer/ffmpeg");
  const ffmpegPath = ffmpegInstaller.path;

  await fs.mkdir(outputRoot, { recursive: true });

  for (const v of VARIANTS) {
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
  const masterBody = buildMasterPlaylist(VARIANTS);
  await fs.writeFile(masterPath, masterBody, "utf8");

  const posterPath = path.join(outputRoot, "poster.jpg");
  await execFileAsync(ffmpegPath, [
    "-y",
    "-ss",
    "00:00:01",
    "-i",
    inputPath,
    "-vframes",
    "1",
    "-vf",
    "scale=640:-1",
    posterPath,
  ]);

  return {
    masterRelativeUrl: `/uploads/videos/${path.basename(outputRoot)}/master.m3u8`,
    posterRelativeUrl: `/uploads/videos/${path.basename(outputRoot)}/poster.jpg`,
  };
}

function buildMasterPlaylist(variants: Variant[]): string {
  const lines = ["#EXTM3U", "#EXT-X-VERSION:3"];
  for (const v of variants) {
    lines.push(
      `#EXT-X-STREAM-INF:BANDWIDTH=${v.bandwidth},RESOLUTION=${v.width}x${v.height},NAME="${v.dir}"`
    );
    lines.push(`${v.dir}/playlist.m3u8`);
  }
  return `${lines.join("\n")}\n`;
}
