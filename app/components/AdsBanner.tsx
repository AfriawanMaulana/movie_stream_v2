"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/zustand/userStore";

interface AdsBannerProps {
  adKey?: string;
  mobileAdKey?: string;
  width?: number;
  height?: number;
  mobileWidth?: number;
  mobileHeight?: number;
  className?: string;
}

export default function AdsBanner({
  adKey = "",
  mobileAdKey = "",
  width = 728,
  height = 90,
  mobileWidth = 320,
  mobileHeight = 50,
  className = "",
}: AdsBannerProps) {
  const [loaded, setLoaded] = useState(false);
  const [showAds, setShowAds] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useUserStore();

  useEffect(() => {
    if (user?.role === "premium" || user?.role === "admin") {
      setShowAds(false);
    } else {
      setShowAds(true);
    }
  }, [user]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const activeAdKey = isMobile && mobileAdKey ? mobileAdKey : adKey;
  const activeWidth = isMobile && mobileAdKey ? mobileWidth : width;
  const activeHeight = isMobile && mobileAdKey ? mobileHeight : height;

  if (!activeAdKey.trim() || !showAds) return null;

  const srcDoc = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #121212;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    iframe {
      max-width: 100% !important;
    }
    </style>
    </head>
    <body>
    <script>
    atOptions = {
      key: "${activeAdKey}",
      format: "iframe",
      height: ${activeHeight},
      width: ${activeWidth},
      params: {}
    };
    </script>
    <script src="https://www.highperformanceformat.com/${activeAdKey}/invoke.js"></script>
    </body>
    </html>
  `;

  return (
    <div
      className={`flex justify-center items-center w-full overflow-hidden ${className}`}
      style={{
        minHeight: loaded ? activeHeight : 0,
      }}
    >
      <iframe
        srcDoc={srcDoc}
        title={activeAdKey}
        width={activeWidth}
        height={activeHeight}
        scrolling="no"
        onLoad={() => setLoaded(true)}
        style={{
          border: "none",
          overflow: "hidden",
          display: loaded ? "block" : "none",
          maxWidth: "100%",
        }}
        className="rounded-lg object-cover"
      />
    </div>
  );
}