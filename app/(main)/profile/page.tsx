"use client";
import { Bookmark, LogOut, MessageCircle, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { toast } from "react-toastify";
import { useUserStore } from "@/zustand/userStore";

export default function Page() {
  const router = useRouter();
  const { user, fetchUser, clearUser } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      await fetchUser();
      setLoading(false);
    }
    init();
  }, [fetchUser]);

  const handleSignOut = async () => {
    const res = await signOut();

    if (res.success) {
      clearUser();
      toast.success(res.message);
      router.push("/");
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };

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
        <div className="flex gap-2">
          <div className="h-8 w-28 rounded-full bg-white/10 animate-pulse" />
          <div className="h-8 w-28 rounded-full bg-white/10 animate-pulse" />
          <div className="h-8 w-28 rounded-full bg-white/10 animate-pulse" />
          <div className="h-8 w-28 rounded-full bg-white/10 animate-pulse" />
        </div>
      </div>
    );

  return (
    <div className="flex flex-col w-full min-h-screen justify-center p-8 md:p-16 space-y-4">
      <div className="flex gap-4 items-center">
        <div className="w-24 h-24 flex flex-shrink-0 justify-center items-center bg-red-500 rounded-full">
          <h2 className="font-semibold text-4xl">{user?.username[0]}</h2>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user?.username}</h1>
          <p className="opacity-70">{user?.email}</p>
          <p className="opacity-50 text-sm font-light">
            Member since{" "}
            {user?.createdAt &&
              new Intl.DateTimeFormat("en-US", {
                month: "long",
                year: "numeric",
              }).format(new Date(user.createdAt))}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          href={"/profile/comments"}
          className="text-sm inline-flex gap-2 items-center border border-secondary/10 rounded-full px-4 py-1.5 bg-secondary/10 text-secondary/70 hover:bg-red-500 hover:text-white cursor-pointer transition-all ease-in-out duration-300"
        >
          <MessageCircle size={16} />
          Comments
        </Link>
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
        <button
          onClick={handleSignOut}
          className="text-sm inline-flex gap-2 items-center border border-secondary/10 rounded-full px-4 py-1.5 bg-secondary/10 text-secondary/70 hover:bg-red-500 hover:text-white cursor-pointer transition-all ease-in-out duration-300"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
