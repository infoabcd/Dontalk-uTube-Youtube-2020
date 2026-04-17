import type { Metadata } from "next";
import RootLayoutClient from "./RootLayoutClient";
import "./globals.css";

export const metadata: Metadata = {
  title: "UTube - Video Sharing Platform",
  description: "A YouTube clone built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
