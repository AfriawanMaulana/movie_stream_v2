import MovieList from "../components/MovieList";
import Navbar from "../components/Navbar";
import MovieSkeleton from "../components/MovieSkeleton";
import { Suspense } from "react";

export default function Page() {
    return (
        <div className="flex flex-col">
            <title>Movies - TERFLIX</title>
            <Navbar />
            <section className="px-5 lg:px-14 py-20">
                <Suspense fallback={<MovieSkeleton />}>
                    <MovieList API_URL="/api/tmdb/discover/movie" filterCountry="" category="movie" header="popular" isPagination />
                </Suspense>
            </section>
        </div>
    )
}
