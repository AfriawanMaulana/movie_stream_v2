import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { ToastContainer } from "react-toastify";
import PWAUpdater from "./pwa-updater";

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "TERFLIX - Nonton Film, Serial TV berbagai Subtitle",
  manifest: "/app/manifest.ts",
  description:
    "Platform streaming film, series, anime, dengan berbagai subtitle tersedia dan menyediakan kualitas terbaik yang ada dipasaran Indonesia secara gratis.",
  icons: {
    icon: "/favicon.png",
  },
  keywords: [
    "movies",
    "tv shows",
    "watchlist",
    "tmdb",
    "terflix",
    "streaming",
    "stream film",
    "movie stream",
    "nonton film",
    "nonton film gratis",
  ],
  openGraph: {
    title: "TERFLIX - Nonton Film, Serial TV berbagai Subtitle",
    description:
      "Platform streaming film, series, anime, dengan berbagai subtitle tersedia dan menyediakan kualitas terbaik yang ada dipasaran Indonesia secara gratis.",
    url: "https://terflix.web.id",
    siteName: "TERFLIX",
    type: "website",
    images: [
      {
        url: "/icon-512x512.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <PWAUpdater />
        <div className="min-h-screen">{children}</div>
        <Analytics />
        <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
      </body>
    </html>
  );
}
