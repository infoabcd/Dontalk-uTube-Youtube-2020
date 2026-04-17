import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  allowedDevOrigins: ["127.0.0.1"],
  serverExternalPackages: ["@ffmpeg-installer/ffmpeg"],
};

export default nextConfig;
