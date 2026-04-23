"use client";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
    main_path: "tv",
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

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const [scrolled, setScrolled] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [processing, setProcessing] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    if (query) setSearchValue(query);
    setProcessing(false);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Tandai apakah user sudah scroll dari posisi top
      setScrolled(currentScrollY > 10);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, query]);

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!searchValue) return;
    router.replace(`/search?query=${encodeURIComponent(searchValue)}`);
    setProcessing(true);
  };

  return (
    <div
      className={`fixed z-50 w-full transition-all duration-300 ease-in-out
    ${showNav ? "translate-y-0" : "-translate-y-full"}
    ${scrolled ? "py-3 px-6" : "py-0 px-0"}
  `}
    >
      <nav
        className={`
      flex justify-between items-center
      transition-all duration-300 ease-in-out
      ${
        scrolled
          ? "max-w-6xl mx-auto px-6 py-5 md:py-3 bg-background/80 backdrop-blur-md shadow-lg shadow-black/40 rounded-2xl"
          : "w-full px-5 h-20 bg-transparent"
      }
    `}
      >
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileNav(!mobileNav)}
          className="md:hidden cursor-pointer "
        >
          {!mobileNav ? (
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
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          ) : (
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
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          )}
        </button>

        {/* Logo */}
        <Link href="/">
          <Image
            src={logoPath}
            alt="logo"
            width={130}
            height={130}
            priority
            className={`h-auto transition-all object-center duration-300 ${
              scrolled ? "w-28" : "w-36"
            }`}
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((item, index) => (
            <div key={index} className="group text-white hover:text-red-500">
              {item.path ? (
                <button className="hidden md:flex items-center gap-2">
                  {item.icon}
                  <p className="line-clamp-1">{item.name}</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
              ) : (
                <Link
                  href={item.main_path}
                  className="hidden md:flex items-center gap-2"
                >
                  {item.icon}
                  <p className="line-clamp-1">{item.name}</p>
                </Link>
              )}

              {/* Dropdown */}
              {item.path && (
                <div className="absolute z-50 opacity-0 group-hover:opacity-100 mt-2 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col gap-3 w-52 shadow-xl shadow-black/50 transition-all duration-200">
                  {item.path.map((sub, i) => (
                    <Link
                      key={i}
                      href={sub.pathUrl}
                      className="text-white/50 hover:text-red-500 text-sm flex items-center gap-3 group/item"
                    >
                      <span className="w-1 h-1 rounded-full bg-white/30 group-hover/item:bg-red-500 transition-colors" />
                      <p>{sub.pathname}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.currentTarget.value)}
              className="hidden md:flex py-2 pl-3 pr-8 w-72 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-red-500/60 focus:bg-white/15 transition-all duration-200 text-sm"
            />
            <button
              type="submit"
              className="absolute cursor-pointer right-0 rounded-md p-2 hover:text-red-500 transition-colors"
            >
              {processing ? (
                <svg
                  aria-hidden="true"
                  className="inline size-5 text-gray-200 animate-spin fill-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              )}
            </button>
          </form>
        </div>

        {/* Mobile nav drawer */}
        {mobileNav && (
          <div
            className={`${
              scrolled ? "p-0" : "px-6"
            } flex flex-col absolute top-full left-0 w-full md:hidden mt-2`}
          >
            <div className="bg-background rounded-2xl">
              {navLinks.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col w-full px-5 py-4 border-b border-white/10"
                >
                  <Link
                    href={item.main_path}
                    className="hover:text-red-500 flex items-center gap-2 mb-2"
                    onClick={() => setMobileNav(false)}
                  >
                    {item.icon}
                    <p className="text-lg font-medium">{item.name}</p>
                  </Link>
                  <div className="grid grid-cols-2 gap-1">
                    {item.path?.map((sub, i) => (
                      <Link
                        key={i}
                        href={sub.pathUrl}
                        className="text-sm text-white/50 hover:text-red-500 flex items-center gap-2 py-1"
                        onClick={() => setMobileNav(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-3 shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                          />
                        </svg>
                        <p>{sub.pathname}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Link href={"/search"} className="md:hidden">
          <Search />
        </Link>
      </nav>
    </div>
  );
}
