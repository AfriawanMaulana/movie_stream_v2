"use client";
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  ClockFading,
  LogIn,
  LogOut,
  Search,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/zustand/userStore";
import { signOut } from "../actions/auth";
import { toast } from "react-toastify";
import FloatingSearchModal from "./FloatingSearchModal";
import { createPortal } from "react-dom";

//* Navbar Dropdown Items
const navLinks = [
  {
    name: "Movies",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        fill="none"
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
        />
      </svg>
    ),
    main_path: "/movie",
    path: [
      { pathname: "Most Watched", pathUrl: "/trending?get=movie" },
      { pathname: "Top Rated", pathUrl: "/top?get=movie" },
      { pathname: "Up Coming", pathUrl: "/upcoming/movie" },
    ],
  },
  {
    name: "TV Series",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        fill="none"
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z"
        />
      </svg>
    ),
    main_path: "/tv",
    path: [
      { pathname: "Most Watched", pathUrl: "/trending?get=tv" },
      { pathname: "Top Rated", pathUrl: "/top?get=tv" },
    ],
  },
  {
    name: "Countries",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
        />
      </svg>
    ),
    main_path: "/countries",
  },
  {
    name: "Genres",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
        />
      </svg>
    ),
    main_path: "/genre",
  },
  {
    name: "Year",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
        />
      </svg>
    ),
    main_path: "/release-year",
  },
];

const logoPath = "/logo-2.png";

/** Avatar bulat kecil dipakai di beberapa tempat (trigger desktop, drawer mobile, dropdown) */
function UserAvatar({
  username,
  size = "w-8 h-8",
}: {
  username?: string;
  size?: string;
}) {
  return (
    <div
      className={`${size} flex flex-shrink-0 items-center justify-center rounded-full bg-red-500`}
    >
      {username ? (
        <h2 className="text-base font-semibold">{username[0].toUpperCase()}</h2>
      ) : (
        <User size={16} className="opacity-80" />
      )}
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathName = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [loadProfile, setLoadProfile] = useState(true);

  const profileRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const { user, fetchUser, clearUser } = useUserStore();

  useEffect(() => {
    fetchUser();
    setLoadProfile(false);
  }, [fetchUser]);

  // Global shortcut buat buka floating search (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenSearchModal((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Klik di luar navRef/profileRef -> tutup menu terkait
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const targetNode = event.target as Node;

      if (profileRef.current && !profileRef.current.contains(targetNode)) {
        setOpenProfile(false);
      }
      if (navRef.current && !navRef.current.contains(targetNode)) {
        setMobileNav(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** Helper: tutup SEMUA menu overlay sekaligus.
   *  Ini yang tadinya bikin drawer mobile nggak nutup: link2 di dalamnya
   *  cuma manggil setOpenProfile(false), padahal mereka ada di dalam navRef
   *  jadi handleClickOutside nggak pernah trigger buat nutup mobileNav.
   */
  const closeAllMenus = () => {
    setOpenProfile(false);
    setMobileNav(false);
  };

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
    closeAllMenus();
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <div
        ref={navRef}
        className={`fixed z-[99] w-full transition-all duration-300 ease-in-out ${
          showNav ? "translate-y-0" : "-translate-y-full"
        } ${scrolled ? "px-6 py-3" : "px-0 py-0"}`}
      >
        <nav
          className={`flex items-center justify-between transition-all duration-300 ease-in-out ${
            scrolled
              ? "mx-auto max-w-6xl rounded-2xl bg-background/80 px-6 py-5 shadow-lg shadow-black/40 backdrop-blur-md md:py-3"
              : "h-20 w-full bg-transparent px-5"
          }`}
        >
          {/* Logo */}
          <Link href="/" onClick={closeAllMenus}>
            <Image
              src={logoPath}
              alt="logo"
              width={130}
              height={130}
              priority
              className={`h-auto object-center transition-all duration-300 ${
                scrolled ? "w-28" : "w-36"
              }`}
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-10 md:flex">
            {navLinks.map((item, index) => (
              <div
                key={index}
                className="group relative text-white hover:text-red-500"
              >
                {item.path ? (
                  <button className="flex items-center gap-2 py-2 cursor-pointer">
                    {item.icon}
                    <p className="line-clamp-1">{item.name}</p>
                    <ChevronDown
                      size={12}
                      className="opacity-70 transition-transform duration-200 group-hover:rotate-180"
                    />
                  </button>
                ) : (
                  <Link href={item.main_path} className="flex items-center gap-2 py-2">
                    {item.icon}
                    <p className="line-clamp-1">{item.name}</p>
                  </Link>
                )}

                {/* Dropdown */}
                {item.path && (
                  <div className="invisible absolute left-0 top-full z-50 flex w-52 flex-col gap-3 rounded-xl border border-white/10 bg-black/90 p-4 opacity-0 shadow-xl shadow-black/50 backdrop-blur-md transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    {item.path.map((sub, i) => (
                      <Link
                        key={i}
                        href={sub.pathUrl}
                        className="group/item flex items-center gap-3 text-sm text-white/50 hover:text-red-500"
                      >
                        <span className="h-1 w-1 rounded-full bg-white/30 transition-colors group-hover/item:bg-red-500" />
                        <p>{sub.pathname}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Floating Search Trigger */}
            <button
              onClick={() => setOpenSearchModal(true)}
              aria-label="Open Search"
              className="flex items-center gap-2 text-white transition-colors hover:text-red-500 cursor-pointer"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Account */}
            <div ref={profileRef} className="relative">
              {loadProfile ? (
                <div className="flex w-36 items-center gap-2 rounded-full border border-secondary/20 p-1.5">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-secondary/20" />
                  <div className="h-3 w-18 animate-pulse rounded bg-secondary/20" />
                  <ChevronDown size={14} className="animate-pulse opacity-80" />
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setOpenProfile((prev) => !prev)}
                    className={`${
                      openProfile ? "bg-secondary/15" : ""
                    } flex cursor-pointer items-center justify-between gap-2 rounded-full border border-secondary/20 p-1.5 transition-all duration-300 ease-in-out hover:bg-secondary/15`}
                  >
                    <UserAvatar username={user?.username} />
                    <p className="font-semibold">{user?.username || "Account"}</p>
                    <ChevronDown size={14} className="opacity-80" />
                  </button>

                  {openProfile && (
                    <div className="absolute right-0 top-full mt-2 w-96 space-y-3 rounded-2xl bg-primary/90 p-4">
                      <ProfileHeader user={user} onNavigate={closeAllMenus} />
                      <ProfileMenu
                        user={user}
                        pathName={pathName}
                        onNavigate={closeAllMenus}
                        onSignOut={handleSignOut}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Mobile nav drawer */}
          {mobileNav && (
            <div
              className={`absolute left-0 top-full mt-2 flex w-full flex-col gap-1 md:hidden ${
                scrolled ? "p-0" : "px-6"
              }`}
            >
              <div className="h-auto w-full space-y-3 rounded-2xl bg-primary/90 p-4">
                <ProfileHeader user={user} onNavigate={closeAllMenus} />
                <ProfileMenu
                  user={user}
                  pathName={pathName}
                  onNavigate={closeAllMenus}
                  onSignOut={handleSignOut}
                />
              </div>

              <div className="rounded-2xl bg-background">
                {navLinks.map((item, index) => (
                  <div
                    key={index}
                    className="flex w-full flex-col border-b border-white/10 px-5 py-4"
                  >
                    <Link
                      href={item.main_path}
                      className="mb-2 flex items-center gap-2 hover:text-red-500"
                      onClick={closeAllMenus}
                    >
                      {item.icon}
                      <p className="text-lg font-medium">{item.name}</p>
                    </Link>
                    {item.path && (
                      <div className="grid grid-cols-2 gap-1">
                        {item.path.map((sub, i) => (
                          <Link
                            key={i}
                            href={sub.pathUrl}
                            className="flex items-center gap-2 py-1 text-sm text-white/50 hover:text-red-500"
                            onClick={closeAllMenus}
                          >
                            <ChevronDown size={12} className="-rotate-90 shrink-0" />
                            <p>{sub.pathname}</p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mobile trigger */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setOpenSearchModal(true)}
              aria-label="Open Search"
              className="text-white transition-colors hover:text-red-500 cursor-pointer"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setMobileNav((prev) => !prev)}
              className="flex cursor-pointer items-center justify-between gap-2 transition-all duration-300 ease-in-out"
            >
              <div className="rounded-full bg-secondary/20 p-0.5">
                <UserAvatar username={user?.username} />
              </div>
              {mobileNav ? (
                <ChevronUp size={14} className="opacity-80" />
              ) : (
                <ChevronDown size={14} className="opacity-80" />
              )}
            </button>
          </div>
        </nav>
      </div>
      {mounted &&
      createPortal(
        <FloatingSearchModal
          isOpen={openSearchModal}
          onClose={() => setOpenSearchModal(false)}
        />,
        document.body
      )}
    </>
  );
}

/** Header user (avatar + nama + email) di dropdown desktop & drawer mobile */
function ProfileHeader({
  user,
  onNavigate,
}: {
  user: { username: string; email?: string } | null;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={user ? "/profile" : "/auth/login"}
      onClick={onNavigate}
      className="flex items-center gap-4 rounded-xl bg-secondary/5 p-2"
    >
      <UserAvatar username={user?.username} size="w-12 h-12" />
      <div>
        <h1 className="font-semibold">{user?.username || "Account"}</h1>
        <p className="text-sm opacity-50">
          {user?.email || "Sign in to save your list."}
        </p>
      </div>
    </Link>
  );
}

/** Isi menu: sign in/up kalau belum login, atau list menu + logout kalau sudah */
function ProfileMenu({
  user,
  pathName,
  onNavigate,
  onSignOut,
}: {
  user: { username: string; email?: string } | null;
  pathName: string;
  onNavigate: () => void;
  onSignOut: () => void;
}) {
  if (!user) {
    return (
      <div className="flex w-full justify-between gap-4">
        <Link
          href="/auth/login"
          onClick={onNavigate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-secondary/20 py-3 font-semibold opacity-70 transition-all duration-300 ease-in-out hover:bg-secondary/5"
        >
          <LogIn size={16} /> Sign in
        </Link>
        <Link
          href="/auth/register"
          onClick={onNavigate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-secondary/20 bg-secondary/5 py-3 font-semibold text-red-500 opacity-70 transition-all duration-300 ease-in-out hover:border-red-500/50 hover:bg-secondary/10"
        >
          <User size={16} /> Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Link
        href="/profile/watchlist"
        onClick={onNavigate}
        className={`${
          pathName === "/profile/watchlist" ? "bg-secondary/5" : ""
        } flex cursor-pointer items-center justify-center gap-2 rounded-md border border-secondary/20 p-2 hover:bg-secondary/5`}
      >
        <Bookmark size={16} color="yellow" className="opacity-60" />
        <p className="font-semibold opacity-60">My List</p>
      </Link>

      <Link
        href="/profile/history"
        onClick={onNavigate}
        className={`${
          pathName === "/profile/history" ? "bg-secondary/5" : ""
        } flex cursor-pointer items-center justify-center gap-2 rounded-md border border-secondary/20 p-2 hover:bg-secondary/5`}
      >
        <ClockFading size={16} color="yellow" className="opacity-60" />
        <p className="font-semibold opacity-60">Watch History</p>
      </Link>

      <div className="space-y-2">
        <Link
          href="/profile"
          onClick={onNavigate}
          className={`${
            pathName === "/profile" ? "bg-secondary/5 text-red-500" : "text-secondary/50"
          } flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 transition-all duration-300 ease-in-out hover:bg-secondary/5 hover:text-red-500`}
        >
          <User size={16} />
          <p className="font-semibold">My Profile</p>
        </Link>
        <button
          onClick={onSignOut}
          className="flex w-full cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-red-500 transition-all duration-300 ease-in-out hover:border hover:border-red-500 hover:bg-red-500/10"
        >
          <LogOut size={16} />
          <p className="font-semibold">Logout</p>
        </button>
      </div>
    </div>
  );
}