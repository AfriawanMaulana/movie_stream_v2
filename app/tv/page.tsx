import MovieList from "../components/MovieList";
import Navbar from "../components/Navbar";

export default function Page() {
    return (
        <div className="flex flex-col">
            <Navbar />
            <MovieList API_URL="/api/tmdb/tv/popular" category="movie" header="paling populer" isPagination />
            <div></div>
        </div>
    )
}