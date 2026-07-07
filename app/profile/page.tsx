"use client";
import { Bookmark, Settings } from "lucide-react";
import { getUser } from "../actions/getUser";
import { UserType } from "@/types/userType";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Page() {
  const pathName = usePathname();

  const [userData, setUserData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getUser();
        if (res) {
          setUserData(res);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col w-full min-h-screen justify-center p-8 md:p-16 space-y-4">
        <div className="flex gap-4 items-center">
          <div className="w-24 h-24 flex justify-center items-center bg-secondary/20 rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-40 rounded-full bg-white/10 animate-pulse" />
            <div className="h-2 w-56 rounded-full bg-white/10 animate-pulse" />
            <div className="h-2 w-32 rounded-full bg-white/10 animate-pulse" />
          </div>
        </div>
        <div>
          <div className="h-8 w-28 rounded-full bg-white/10 animate-pulse" />
        </div>
      </div>
    );

  return (
    <div className="flex flex-col w-full min-h-screen justify-center p-8 md:p-16 space-y-4">
      <div className="flex gap-4 items-center">
        <div className="w-24 h-24 flex flex-shrink-0 justify-center items-center bg-red-500 rounded-full">
          <h2 className="font-semibold text-4xl">{userData?.username[0]}</h2>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{userData?.username}</h1>
          <p className="opacity-70">{userData?.email}</p>
          <p className="opacity-50 text-sm font-light">
            Member since{" "}
            {userData?.createdAt &&
              new Intl.DateTimeFormat("en-US", {
                month: "long",
                year: "numeric",
              }).format(new Date(userData.createdAt))}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          href={"/profile/watchlist"}
          className="text-sm inline-flex gap-2 items-center border border-secondary/10 rounded-full px-4 py-1.5 bg-secondary/10 text-secondary/70 hover:bg-red-500 hover:text-white cursor-pointer transition-all ease-in-out duration-300"
        >
          <Bookmark size={16} />
          Watchlist
        </Link>
        <Link
          href={"/profile/settings"}
          className="text-sm inline-flex gap-2 items-center border border-secondary/10 rounded-full px-4 py-1.5 bg-secondary/10 text-secondary/70 hover:bg-red-500 hover:text-white cursor-pointer transition-all ease-in-out duration-300"
        >
          <Settings size={16} />
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
