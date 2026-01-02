"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function CategorySwitch({ active }: { active: "movie" | "tv" }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const switchCategory = (type: "movie" | "tv") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", type);
    params.set("page", "1"); // reset pagination
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="my-4 flex gap-4">
      {(["movie", "tv"] as const).map((type) => (
        <button
          key={type}
          onClick={() => switchCategory(type)}
          className={`${
            active === type
              ? "text-red-500 border border-red-500 scale-105"
              : "border border-white/20 text-white/50"
          } transition-all duration-200 ease-in-out text-sm font-semibold px-4 py-2 rounded-md`}
        >
          {type.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
