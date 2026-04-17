import type { MetadataRoute } from "next";
import { prisma } from "@/app/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const origin = new URL(base).origin;
  const staticEntries: MetadataRoute.Sitemap = [
    { url: origin, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    {
      url: `${origin}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${origin}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  try {
    const videos = await prisma.video.findMany({
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 5000,
    });
    const watchEntries: MetadataRoute.Sitemap = videos.map((v) => ({
      url: `${origin}/watch/${v.id}`,
      lastModified: v.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    return [...staticEntries, ...watchEntries];
  } catch {
    return staticEntries;
  }
}
