"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function TrafficTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!pathname) return;
    if (lastTrackedPath.current === pathname) return;

    // Do not track dashboard or api routes
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/_next")
    ) {
      return;
    }

    lastTrackedPath.current = pathname;

    let visitorId = localStorage.getItem("ms_visitor_id");
    if (!visitorId) {
      visitorId = `v_${Math.random().toString(36).substring(2)}_${Date.now()}`;
      localStorage.setItem("ms_visitor_id", visitorId);
    }

    const payload = JSON.stringify({ path: pathname, visitorId });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/track", blob);
    } else {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
