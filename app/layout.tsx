import type { Metadata } from "next";
import RootLayoutClient from "./RootLayoutClient";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/favicon.ico",
  },
  title: {
    default: "Dontalk-uTube — 影片分享",
    template: "%s | Dontalk-uTube",
  },
  description:
    "Dontalk-uTube 是一個影片分享平台，受邀用戶可以上載與觀看影片，支援 HLS 多碼率播放、頻道與留言。感謝你的訪問與觀看。",
  openGraph: {
    type: "website",
    locale: "zh_HK",
    siteName: "Dontalk-uTube",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
