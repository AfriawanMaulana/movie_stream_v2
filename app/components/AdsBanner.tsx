"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/zustand/userStore";

interface AdsBannerProps {
  adKey?: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function AdsBanner({
  adKey = "",
  width = 728,
  height = 90,
  className = "",
}: AdsBannerProps) {
    const [loaded, setLoaded] = useState(false);
    const [showAds, setShowAds] = useState(false);
    const { user, loading } = useUserStore();

    useEffect(() => {
        if (user?.role === "premium" || user?.role === "admin") setShowAds(false);
        else setShowAds(true);
    }, [user])



    if (!adKey.trim()) return null;

    const srcDoc = `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="utf-8">
        <style>
        html,
        body{
        margin:0;
        padding:0;
        width:100%;
        height:100%;
        overflow:hidden;
        background:black;
        display:flex;
        justify-content:center;
        align-items:center;
        }
        </style>
        </head>

        <body>
        <script>
        atOptions = {
        key: "${adKey}",
        format: "iframe",
        height: ${height},
        width: ${width},
        params: {}
        };
        </script>

        <script src="https://www.highperformanceformat.com/${adKey}/invoke.js"></script>
        </body>
        </html>
    `;
    if (!showAds) return;
    return (
        <div className={`flex justify-center ${className}`} style={{
            minHeight: loaded ? height : 0,
        }}>
        <iframe
            srcDoc={srcDoc}
            title={adKey}
            width={width}
            height={height}
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