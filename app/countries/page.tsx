import Navbar from "../components/Navbar";
import Link from "next/link";

const DataCountries = [
  {
    id: "id",
    name: "Indonesia",
  },
];

export default function Page() {
  return (
    <div>
      <title>Genre - TERFLIX</title>
      <Navbar />
      <section className="flex flex-col space-y-8 px-5 lg:px-14 py-20">
        <div className="p-4 border-b border-white/20">
          <h1 className="text-4xl">Countries</h1>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {DataCountries?.map((country) => (
            <Link
              href={`/countries/${country.id}`}
              key={country.id}
              className="py-2.5 px-4 w-full md:w-[24.2%] rounded-md bg-white/10"
            >
              <p className="text-2xl text-white/90">{country.name}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
