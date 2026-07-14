"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "movie";
  /* ================= HELPERS ================= */

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set(key, value);
    params.set("page", "1"); // reset pagination

    router.push(`?${params.toString()}`);
  };

  /* ================= RENDER ================= */

  return (
    <div className="my-4 flex items-center justify-between">
      {/* CATEGORY BUTTON */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => updateParam("category", "movie")}
          className={`${
            category === "movie"
              ? "text-red-500 border border-red-500 scale-105"
              : "border border-white/20 text-white/50"
          } transition-all duration-200 ease-in-out text-sm font-semibold px-4 py-2 rounded-md`}
        >
          MOVIE
        </button>

        <button
          onClick={() => updateParam("category", "tv")}
          className={`${
            category === "tv"
              ? "text-red-500 border border-red-500 scale-105"
              : "border border-white/20 text-white/50"
          } transition-all duration-200 ease-in-out text-sm font-semibold px-4 py-2 rounded-md`}
        >
          TV
        </button>
      </div>
    </div>
  );
}
