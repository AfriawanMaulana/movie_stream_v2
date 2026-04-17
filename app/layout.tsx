import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/Footer";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "./components/Navbar";
import { Suspense } from "react";
import PWAUpdater from "./pwa-updater";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <PWAUpdater />
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        {children}
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
