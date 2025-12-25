import type { NextConfig } from "next";
import { headers } from "next/headers";

const nextConfig: NextConfig = {
  /* config options here */
  return: [
    {
      source: "/:path*",
      headers: [
        {
          key: "Content-Security-Policy",
          value: "frame-ancestors 'self'; navigate-to 'self';",
        },
      ],
    },
  ],
  images: {
    remotePatterns: [
      {
        hostname: "image.tmdb.org",
      },
    ],
  },
};

export default nextConfig;
