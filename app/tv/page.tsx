import MovieList from "../components/MovieList";
import Navbar from "../components/Navbar";

export default function Page() {
    return (
        <div className="flex flex-col">
            <title>TV Series - TERFLIX</title>
            <Navbar />
            <section className="px-5 lg:px-14 py-20">
                <MovieList API_URL="/api/tmdb/tv/popular" category="tv" header="trending" isPagination />
            </section>
        </div>
    )
}