import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/Footer";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "TERFLIX - Nonton Film, Serial TV berbagai Subtitle",
  description: "Free Movie Streaming",
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
        {children}

        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
