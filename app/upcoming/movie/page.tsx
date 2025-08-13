import MovieList from "@/app/components/MovieList";
import Navbar from "@/app/components/Navbar";


export default function Page() {
    const today = new Date().toISOString().split('T')[0];
    
    return (
        <div>
            <Navbar />
            <section className="px-5 lg:px-14 py-20">
                <MovieList API_URL={`/api/tmdb/discover/movie?sort_by=release_date&primary_release_date.gte=${today}`} isParam header="up coming" category="movie" isPagination />
            </section>
        </div>
    )
}