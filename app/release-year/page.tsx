import Navbar from "../components/Navbar";
import Link from "next/link";


export default function Page() {
    const tankYear = []

    const getYear = new Date().getFullYear();
    for (let i = getYear; i >= 1980; i--) {
        tankYear.push(i);
    }

    return (
        <div>
            <title>Release Year - TERFLIX</title>
            <Navbar />
            <section className="flex flex-col space-y-8 px-5 lg:px-14 py-20">
                <div className="p-4 border-b border-white/20">
                    <h1 className="text-4xl">Release Year</h1>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {tankYear.map((item) => (
                        <Link href={`/release-year/${item}`} key={item} className="py-2.5 px-4 w-full md:w-[24.2%] rounded-md bg-white/10">
                            <p className="text-2xl text-white/90">{item}</p>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    )
}