import Link from "next/link";
import Image from "next/image";

const navLinks = [
  {
    name: "Movies",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
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
    main_path: "/movies",
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
    name: "Genre",
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

export default function Footer() {
  return (
    <footer className="flex flex-col gap-6 md:flex-row justify-between w-full h-auto border-t border-white/20 px-5 lg:px-14 py-10">
      <div className="flex flex-col space-y-3 items-center md:items-start w-full md:w-96">
        <Link href={"/"} className="font-black text-2xl text-red-500">
          <Image
            src={"/logo-halloween.png"}
            alt="logo.png"
            width={200}
            height={200}
            className="w-48 h-auto"
          />
        </Link>
        <p className="text-[13px] text-center md:text-start text-white/80">
          TERFLIX adalah platform streaming film, series, anime, dengan berbagai
          subtitle tersedia dan menyediakan kualitas terbaik yang ada dipasaran
          Indonesia secara gratis, namun tidak seperti platform streaming
          lainnya, TERFLIX ingin menyediakan layanan nonton film dengan kualitas
          bagus dan tidak ada bayaran apapun untuk menikmati film atau series
          yang ada disitus TERFLIX ini, karena tidak semua wilayah di Indonesia
          memiliki bioskop untuk menonton film-film terbaru.
        </p>
      </div>
      <div className="flex flex-wrap gap-10">
        {navLinks.map((item, i) => (
          <div key={i} className="flex flex-col gap-2">
            <h1 className="font-semibold opacity-80 text-2xl mb-4">
              {item.name}
            </h1>
            {item.path?.map((path, i) => (
              <Link
                href={path.pathUrl}
                key={i}
                className="text-white/50 hover:text-red-500"
              >
                - {path.pathname}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </footer>
  );
}
