"use client";

import { useEffect } from "react";

export default function PWAUpdater() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload(); // 🔥 auto refresh
      });
    }
  }, []);

  return null;
}
