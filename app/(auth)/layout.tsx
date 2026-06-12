import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "TERFLIX - Nonton Film, Serial TV berbagai Subtitle",
  manifest: "/app/manifest.ts",
  themeColor: "#000000",
  description:
    "Platform streaming film, series, anime, dengan berbagai subtitle tersedia dan menyediakan kualitas terbaik yang ada dipasaran Indonesia secara gratis.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <div className="min-h-screen">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
