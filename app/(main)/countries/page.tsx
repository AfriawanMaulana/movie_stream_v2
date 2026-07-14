import Link from "next/link";
import countries from "./countries.json";

const dataCountries = countries.results.sort((a, b) =>
  a.english_name.localeCompare(b.english_name, "id", { sensitivity: "base" })
);

export default function Page() {
  return (
    <div>
      <title>Genre - TERFLIX</title>

      <section className="flex flex-col space-y-8 px-5 lg:px-14 py-20">
        <div className="p-4 border-b border-white/20">
          <h1 className="text-4xl">Countries</h1>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {dataCountries?.map((country) => (
            <Link
              href={`/countries/${country.iso_3166_1}`}
              key={country.iso_3166_1}
              className="py-2.5 px-4 w-full md:w-[24.2%] rounded-md bg-white/10 hover:border hover:border-red-500 hover:text-red-500 transition-all duration-300 ease-in-out"
            >
              <p className="text-2xl">{country.english_name}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
